import { withAuth } from "next-auth/middleware";

export default withAuth(
    function (req) {

    }, {
    callbacks: {
        authorized: ({ token }) => !!token
    }
}
)

export const config = {
    matcher: [
        "/admin/((?!login).*)",
        "/api/admin/:path*"
    ]
}