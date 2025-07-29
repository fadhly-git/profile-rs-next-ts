// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        console.log("Middleware triggered for path:", req.nextUrl.pathname);
        const { pathname } = req.nextUrl;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const token = (req as any).nextauth?.token;

        // Redirect rules
        if (pathname === "/admin/login" && token) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }

        if (pathname === "/admin" && token) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                return !!token
            }
        },
        pages: {
            signIn: "/admin/login",
        },
    }
);

export const config = {
    matcher: [
        "/admin/:path*",
        "/admin/((?!login).*)",
        "/admin/dashboard",
        "/api/admin/:path*",
    ],
};