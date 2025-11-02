// Role hierarchy utility functions
export type UserRole = 'user' | 'contributor' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  is_approved_contributor: boolean
  total_score: number
  problems_solved: number
  can_become_contributor: boolean
}

// Role hierarchy: user < contributor < admin
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 1,
  contributor: 2,
  admin: 3
}

// Check if user has minimum role level
export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

// Check if user can access user features
export const canAccessUser = (user: User | null): boolean => {
  return !!user && hasRole(user.role, 'user')
}

// Check if user can access contributor features
export const canAccessContributor = (user: User | null): boolean => {
  return !!user && (
    hasRole(user.role, 'contributor') || 
    (user.role === 'contributor' && user.is_approved_contributor)
  )
}

// Check if user can access admin features
export const canAccessAdmin = (user: User | null): boolean => {
  return !!user && hasRole(user.role, 'admin')
}

// Get user's effective permissions
export const getUserPermissions = (user: User | null) => {
  if (!user) {
    return {
      canAccessUser: false,
      canAccessContributor: false,
      canAccessAdmin: false,
      roleLevel: 0
    }
  }

  return {
    canAccessUser: canAccessUser(user),
    canAccessContributor: canAccessContributor(user),
    canAccessAdmin: canAccessAdmin(user),
    roleLevel: ROLE_HIERARCHY[user.role]
  }
}

// Get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    user: 'User',
    contributor: 'Contributor',
    admin: 'Administrator'
  }
  return roleNames[role]
}

// Get role description
export const getRoleDescription = (role: UserRole): string => {
  const descriptions: Record<UserRole, string> = {
    user: 'Basic access to courses, problems, and community features',
    contributor: 'Can create content, courses, and manage community (includes all user features)',
    admin: 'Full system access including user management and analytics (includes all features)'
  }
  return descriptions[role]
}
