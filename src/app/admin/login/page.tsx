// app/admin/login/page.tsx
"use client"

import { signIn, getSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    // app/admin/login/page.tsx - tambahkan di useEffect
    useEffect(() => {
        // Clear any existing session dan storage
        signOut({ redirect: false })
        localStorage.clear()
        sessionStorage.clear()
    }, [])

    useEffect(() => {
        const error = searchParams.get('error')
        if (error === 'AccessDenied') {
            setError('Access denied - insufficient permissions')
        } else if (error === 'CredentialsSignin') {
            setError('Invalid email or password')
        }
    }, [searchParams])

    // Check if user is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            const session = await getSession()
            if (session?.user) {
                router.replace('/admin/dashboard')
            }
        }
        checkAuth()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            })

            if (result?.error) {
                setError('Invalid email or password')
            } else if (result?.ok) {
                router.push('/admin/dashboard')
            }
        } catch (error) {
            setError('An error occurred during login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4 p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Admin Login</h1>

                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border rounded-md"
                    />
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 border rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-3 bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}