// types/next-auth.d.ts
import NextAuth from "next-auth"
import { EnumRoleUsers } from "@prisma/client"

declare module "next-auth" {
    interface User {
        id: string
        email: string
        name: string
        role: EnumRoleUsers
        image?: string
    }

    interface Session {
        user: {
            id: string
            email: string
            name: string
            role: EnumRoleUsers
            image?: string
            permissions: Array<{
                resource: string
                action: string
            }>
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: EnumRoleUsers
    }
}