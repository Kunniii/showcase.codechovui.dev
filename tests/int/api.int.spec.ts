import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('verifies comment access control for anonymous and authenticated users', async () => {
    // 1. Cleanup any existing test user to satisfy unique constraint
    await payload.delete({
      collection: 'users',
      where: {
        email: {
          equals: 'admin-test@example.com',
        },
      },
    })

    // Create a fresh test user
    const user = await payload.create({
      collection: 'users',
      data: {
        email: 'admin-test@example.com',
        password: 'password123',
      },
    })

    // 2. Create a test work (using a dummy ID 1 for showcaseImage to bypass media upload requirement)
    const work = await payload.create({
      collection: 'works',
      data: {
        title: 'test work',
        category: 'photography',
        showcaseImage: 1,
      },
    })

    // 3. Test Create comment without user (should fail)
    await expect(
      payload.create({
        collection: 'comments',
        data: {
          work: work.id,
          userEmail: 'test@example.com',
          userName: 'Test User',
          content: 'Test comment content',
        },
        overrideAccess: false,
      })
    ).rejects.toThrow()

    // 4. Test Create comment with user (should succeed)
    const comment = await payload.create({
      collection: 'comments',
      data: {
        work: work.id,
        userEmail: 'test@example.com',
        userName: 'Test User',
        content: 'Test comment content',
      },
      user,
      overrideAccess: false,
    })
    expect(comment).toBeDefined()
    expect(comment.content).toBe('Test comment content')

    // 5. Test Update comment without user (should fail)
    await expect(
      payload.update({
        collection: 'comments',
        id: comment.id,
        data: {
          content: 'Updated comment content',
        },
        overrideAccess: false,
      })
    ).rejects.toThrow()

    // 6. Test Update comment with user (should succeed)
    const updatedComment = await payload.update({
      collection: 'comments',
      id: comment.id,
      data: {
        content: 'Updated comment content',
      },
      user,
      overrideAccess: false,
    })
    expect(updatedComment.content).toBe('Updated comment content')

    // 7. Test Delete comment without user (should fail)
    await expect(
      payload.delete({
        collection: 'comments',
        id: comment.id,
        overrideAccess: false,
      })
    ).rejects.toThrow()

    // 8. Test Delete comment with user (should succeed)
    const deletedComment = await payload.delete({
      collection: 'comments',
      id: comment.id,
      user,
      overrideAccess: false,
    })
    expect(deletedComment).toBeDefined()

    // Cleanup
    await payload.delete({
      collection: 'works',
      id: work.id,
    })
    await payload.delete({
      collection: 'users',
      id: user.id,
    })
  })
})

