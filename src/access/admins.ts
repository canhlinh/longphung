import type { Access } from 'payload'

export const admins: Access = ({ req: { user } }) => Boolean(user)

export const anyone: Access = () => true

export const publishedOrAdmin: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
