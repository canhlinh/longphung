import type { Access } from 'payload'

type AdminUser = { role?: string } | null | undefined

export const admins: Access = ({ req: { user } }) => {
  const u = user as AdminUser
  return Boolean(u && u.role === 'admin')
}

export const anyone: Access = () => true

export const publishedOrAdmin: Access = ({ req: { user } }) => {
  // Any authenticated user (staff) can view drafts for preview; public sees only published.
  // Strict admin role gating is applied to create/update/delete via the `admins` function.
  if (user) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
