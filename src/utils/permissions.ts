import { User } from '../types/auth'

export const isSuperAdmin = (user: User | null): boolean => {
  return user?.role === 'super_admin'
}

export const canUploadLogo = (user: User | null): boolean => {
  return isSuperAdmin(user)
}