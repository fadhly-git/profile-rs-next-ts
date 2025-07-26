// lib/auth.ts
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { EnumRoleUsers } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
              deleted_at: null
            }
          })

          if (!user) {
            console.log('User not found:', credentials.email)
            return null
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password)
          if (!isValidPassword) {
            console.log('Invalid password for user:', credentials.email)
            return null
          }

          // Check if user has admin access
          const adminRoles: EnumRoleUsers[] = [
            EnumRoleUsers.SUPER_ADMIN,
            EnumRoleUsers.ADMIN,
            EnumRoleUsers.MODERATOR
          ]

          if (!adminRoles.includes(user.role)) {
            console.log('User does not have admin access:', user.role)
            return null
          }

          console.log('✅ User authorized successfully:', {
            id: user.id.toString(),
            email: user.email,
            role: user.role,
            name: user.name
          })

          // Return user object dengan role
          const authorizedUser = {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.gambar || undefined
          }

          console.log('✅ Returning authorized user:', authorizedUser)
          return authorizedUser

        } catch (error) {
          console.error('❌ Authorization error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      console.log('🔄 JWT Callback triggered:', {
        trigger,
        hasUser: !!user,
        hasToken: !!token,
        tokenSub: token?.sub,
        tokenRole: token?.role,
        userRole: user?.role
      })

      // Pada login pertama, simpan role dari user ke token
      if (user) {
        token.role = user.role
        console.log('💾 JWT callback - saving role to token:', {
          userId: user.id,
          userRole: user.role,
          tokenRole: token.role,
          tokenAfterSave: token
        })
      }

      // Debug final token
      console.log('🔍 Final JWT token:', {
        sub: token.sub,
        role: token.role,
        email: token.email
      })

      return token
    },
    async session({ session, token }) {
      console.log('🔄 Session callback triggered:', {
        tokenSub: token?.sub,
        tokenRole: token?.role,
        sessionUserId: session?.user?.id
      })

      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as EnumRoleUsers

        console.log('💾 Session callback - setting user data:', {
          userId: session.user.id,
          role: session.user.role,
          tokenRole: token.role
        })

        // Load permissions dynamically
        try {
          const userWithPermissions = await prisma.user.findUnique({
            where: { id: BigInt(token.sub as string) },
            include: {
              userPermissions: {
                where: { isGranted: true },
                include: {
                  permission: {
                    include: {
                      resource: true,
                      action: true
                    }
                  }
                }
              }
            }
          })

          if (userWithPermissions) {
            // Get role-based permissions
            const rolePermissions = await prisma.rolePermission.findMany({
              where: {
                role: userWithPermissions.role,
                isGranted: true
              },
              include: {
                permission: {
                  include: {
                    resource: true,
                    action: true
                  }
                }
              }
            })

            // Combine role and user permissions
            const allPermissions = [
              ...rolePermissions.map(rp => ({
                resource: rp.permission.resource.name,
                action: rp.permission.action.name
              })),
              ...userWithPermissions.userPermissions.map(up => ({
                resource: up.permission.resource.name,
                action: up.permission.action.name
              }))
            ]

            // Remove duplicates
            const uniquePermissions = allPermissions.reduce((acc, curr) => {
              const exists = acc.find(p => p.resource === curr.resource && p.action === curr.action)
              if (!exists) acc.push(curr)
              return acc
            }, [] as typeof allPermissions)

            session.user.permissions = uniquePermissions

            console.log('✅ Permissions loaded:', {
              userId: session.user.id,
              permissionsCount: uniquePermissions.length,
              rolePermissions: rolePermissions.length,
              userPermissions: userWithPermissions.userPermissions.length
            })
          } else {
            session.user.permissions = []
          }
        } catch (error) {
          console.error('❌ Failed to load user permissions:', error)
          session.user.permissions = []
        }
      }

      console.log('🔍 Final session:', {
        userId: session.user.id,
        role: session.user.role,
        permissionsCount: session.user.permissions?.length || 0
      })

      return session
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  debug: process.env.NODE_ENV === 'development'
}