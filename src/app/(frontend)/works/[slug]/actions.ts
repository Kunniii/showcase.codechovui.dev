'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export type FormState = {
  success?: boolean;
  error?: string;
}

export async function submitComment(prevState: FormState, formData: FormData): Promise<FormState> {
  const content = formData.get('content') as string
  const workId = formData.get('workId') as string
  const slug = formData.get('slug') as string
  
  if (!content || !content.trim() || !workId) {
    return { error: 'Nội dung bình luận không được để trống.' }
  }

  // 1. Get the auth token from cookies
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return { error: 'Bạn phải đăng nhập để bình luận.' }
  }

  // 2. Validate token and get user profile by calling auth.codechovui.dev
  try {
    const authUrl = process.env.CODECHOVUI_AUTH_URL || 'https://auth.codechovui.dev';
    const response = await fetch(`${authUrl}/api/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      return { error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' }
    }

    const userData = await response.json()
    const userName = userData.user?.profile?.display_name || userData.user?.username || 'Anonymous User'
    const userEmail = userData.user?.profile?.email || 'unknown@email.com'
    const userAvatarType = userData.user?.profile?.avatar_type || null
    const userAvatarData = userData.user?.profile?.avatar_data || null

    // 3. Save the comment securely to Payload CMS
    const payload = await getPayload({ config: configPromise })
    
    await payload.create({
      collection: 'comments',
      data: {
        work: parseInt(workId, 10) || workId as any, // ID type depends on SQLite adapter (usually numerical ID)
        content: content.trim(),
        userName: userName,
        userEmail: userEmail,
        userAvatarType: userAvatarType,
        userAvatarData: userAvatarData,
      },
    })

    // 4. Revalidate the page to show new comment immediately
    revalidatePath(`/works/${slug}`)
    
    return { success: true }
  } catch (error) {
    console.error('Submit comment error:', error)
    return { error: 'Có lỗi xảy ra khi lưu bình luận. Vui lòng thử lại sau.' }
  }
}
