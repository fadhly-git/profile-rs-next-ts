/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useSession } from "next-auth/react"
import { useMemo } from "react"
import { EnumRoleUsers } from "@prisma/client"

const ROLE_HIERARCHY = {
    [EnumRoleUsers.USER]: 1,
    [EnumRoleUsers.MODERATOR]: 2,
    [EnumRoleUsers.ADMIN]: 3,
    [EnumRoleUsers.SUPER_ADMIN]: 4,
}

const PAGE_RESOURCE_MAP: Record<string, string> = {
    '/admin/dashboard': 'dashboard',
    '/admin/kritik-saran': 'kritik_saran',
    '/admin/kategori': 'kategori',
    '/admin/berita': 'berita',
    '/admin/hero-section': 'hero_section',
    '/admin/indikator-mutu': 'indikator_mutu',
    '/admin/user-management': 'users',
    '/admin/website-settings': 'website_settings',
    '/admin/about-us': 'about_us',
    '/admin/promotions': 'promotions',
    '/admin/dokter': 'dokter',
    '/admin/jadwal-dokter': 'jadwal_dokter',
    '/admin/menu': 'menu',
    '/admin/halaman': 'halaman',
    '/admin/feature-blocks': 'feature_blocks',
    '/admin/visitors': 'visitors',
}

export function useRBAC() {

    const { data: session, status, update } = useSession()

    const permissions = useMemo(() => {
        return session?.user?.permissions || []
    }, [session?.user?.permissions])

    // Di useRBAC hook, tambahkan di awal function
    console.log('useRBAC Debug:', {
        status,
        userId: session?.user?.id,
        role: session?.user?.role,
        permissionsCount: permissions.length,
        timestamp: new Date().toISOString()
    })

    const apiCall = async (endpoint: string, options?: RequestInit) => {
        const response = await fetch(`/api/admin${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        })

        if (response.status === 401) {
            window.location.href = '/admin/login'
            return null
        }

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'API call failed')
        }

        return response.json()
    }

    const hasPermission = (action: string, resource: string): boolean => {
        if (status !== 'authenticated' || !session?.user) return false

        return permissions.some(p => p.action === action && p.resource === resource)
    }

    const canAccess = (page: string): boolean => {
        const resource = PAGE_RESOURCE_MAP[page]
        if (!resource) return false

        return hasPermission('read', resource)
    }

    const canEdit = (resource: string): boolean => {
        return hasPermission('update', resource)
    }

    const canCreate = (resource: string): boolean => {
        return hasPermission('create', resource)
    }

    const canDelete = (resource: string): boolean => {
        return hasPermission('delete', resource)
    }

    const canPublish = (resource: string): boolean => {
        return hasPermission('publish', resource)
    }

    const canRestore = (resource: string): boolean => {
        return hasPermission('restore', resource)
    }

    const canManageAll = (resource: string): boolean => {
        return hasPermission('manage_all', resource)
    }

    const canManageUserWithRole = (targetRole: EnumRoleUsers): boolean => {
        if (!session?.user?.role) return false

        const currentUserLevel = ROLE_HIERARCHY[session.user.role]
        const targetUserLevel = ROLE_HIERARCHY[targetRole]

        return currentUserLevel > targetUserLevel
    }

    const canEditContent = (resource: string, contentOwnerId?: string): boolean => {
        if (!session?.user) return false

        if (!contentOwnerId) {
            return hasPermission('update', resource)
        }

        if (contentOwnerId === session.user.id) {
            return hasPermission('update', resource)
        }

        return canManageAll(resource)
    }

    const getFilteredNavigation = (navigation: any[]): any[] => {
        if (status !== 'authenticated') return []

        return navigation.filter(item => {
            if (item.url && item.url !== '#') {
                if (!canAccess(item.url)) return false
            }

            if (item.items) {
                item.items = item.items.filter((subItem: any) => {
                    if (subItem.url && subItem.url !== '#') {
                        return canAccess(subItem.url)
                    }
                    return true
                })

                if (item.items.length === 0 && item.url === '#') return false
            }

            return true
        })
    }

    const refreshPermissions = async () => {
        await update()
    }

    return {
        user: session?.user,
        permissions,
        loading: status === 'loading',
        authenticated: status === 'authenticated',
        hasPermission,
        canAccess,
        canEdit,
        canCreate,
        canDelete,
        canPublish,
        canRestore,
        canManageAll,
        canManageUserWithRole,
        canEditContent,
        getFilteredNavigation,
        refreshPermissions,
        apiCall
    }
}