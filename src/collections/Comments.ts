import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'userName',
    defaultColumns: ['userName', 'userEmail', 'work', 'createdAt'],
  },
  access: {
    read: () => true, // Anyone can read comments
    create: ({ req: { user } }) => Boolean(user), // Authenticated users (admin) can create comments
    update: ({ req: { user } }) => Boolean(user), // Authenticated users (admin) can update comments
    delete: ({ req: { user } }) => Boolean(user), // Authenticated users (admin) can delete comments
  },
  fields: [
    {
      name: 'work',
      type: 'relationship',
      relationTo: 'works',
      required: true,
      index: true,
    },
    {
      name: 'userEmail',
      type: 'text',
      required: true,
    },
    {
      name: 'userName',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'userAvatarType',
      type: 'text',
    },
    {
      name: 'userAvatarData',
      type: 'text',
    },
  ],
}
