
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LayoutDashboard, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Attempt login
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (signInError) {
            // If login fails, try signup (for hackathon convenience)
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            })

            if (signUpError) {
                setError(signInError.message) // Show original error usually
            } else {
                // Signup successful, now login
                router.refresh()
                router.push('/dashboard')
            }
        } else {
            router.refresh()
            router.push('/dashboard')
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <LayoutDashboard className="h-6 w-6" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        PayAware
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Secure, Ethical, Awareness-First Finance
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Sign In / Sign Up
                    </Button>
                </form>

                <div className="text-center text-xs text-gray-500">
                    <p>By continuing you agree to our ethical design principles.</p>
                </div>
            </div>
        </div>
    )
}
