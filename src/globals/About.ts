import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  admin: {
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Ủa mình là ai ta?',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}
