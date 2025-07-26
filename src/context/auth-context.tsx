"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
    id: string
    name: string
    email: string
    role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'USER'
    gambar?: string | null
}

interface AuthContextType {
    user: User | null
    setUser: (user: User | null) => void
    hasPermission: (action: string, resource: string) => boolean
    canManageUsers: () => boolean
    canEditUser: (targetRole: string) => boolean
    canDeleteUser: (targetRole: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Role hierarchy (higher number = higher privilege)
const ROLE_HIERARCHY = {
    'USER': 1,
    'MODERATOR': 2,
    'ADMIN': 3,
    'SUPER_ADMIN': 4
}

// Permissions mapping
const PERMISSIONS = {
    'SUPER_ADMIN': {
        users: ['create', 'read', 'update', 'delete', 'restore', 'permanent_delete'],
        all: ['*']
    },
    'ADMIN': {
        users: ['create', 'read', 'update', 'delete', 'restore'],
    },
    'MODERATOR': {
        users: ['read', 'update'],
    },
    'USER': {
        users: ['read']
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    // Simulate getting current user - replace with real auth logic
    useEffect(() => {
        // For demo purposes, set a mock user
        // In real app, get this from session/JWT/cookie
        setUser({
            id: '1',
            name: 'Admin User',
            email: 'admin@hospital.com',
            role: 'ADMIN' // Change this to test different roles
        })
    }, [])

    const hasPermission = (action: string, resource: string): boolean => {
        if (!user) return false

        const userPermissions = PERMISSIONS[user.role as keyof typeof PERMISSIONS]
        if (!userPermissions) return false

        // Check if user has all permissions
        if ((userPermissions as { all?: string[] }).all?.includes('*')) return true

        // Check specific resource permissions
        const resourcePermissions = userPermissions[resource as keyof typeof userPermissions] as string[]
        return resourcePermissions?.includes(action) || false
    }

    const canManageUsers = (): boolean => {
        return hasPermission('read', 'users')
    }

    const canEditUser = (targetRole: string): boolean => {
        if (!user) return false

        // Can't edit users with equal or higher role
        const userLevel = ROLE_HIERARCHY[user.role as keyof typeof ROLE_HIERARCHY]
        const targetLevel = ROLE_HIERARCHY[targetRole as keyof typeof ROLE_HIERARCHY]

        return hasPermission('update', 'users') && userLevel > targetLevel
    }

    const canDeleteUser = (targetRole: string): boolean => {
        if (!user) return false

        // Can't delete users with equal or higher role
        const userLevel = ROLE_HIERARCHY[user.role as keyof typeof ROLE_HIERARCHY]
        const targetLevel = ROLE_HIERARCHY[targetRole as keyof typeof ROLE_HIERARCHY]

        return hasPermission('delete', 'users') && userLevel > targetLevel
    }

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            hasPermission,
            canManageUsers,
            canEditUser,
            canDeleteUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}