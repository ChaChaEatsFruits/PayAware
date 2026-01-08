
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'

type RouteHandler = (req: NextRequest, context: any) => Promise<NextResponse>

export function withSecurity(handler: RouteHandler, options: { protected: boolean } = { protected: true }) {
    return async (req: NextRequest, context: any) => {
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
        let userId = 'anonymous'

        // 1. Auth Check (if protected)
        if (options.protected) {
            const supabase = await createClient()
            const { data: { user }, error } = await supabase.auth.getUser()

            if (error || !user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
            userId = user.id
        }

        // 2. Rate Limiting
        // 100 requests per minute as requested
        const identifier = options.protected ? `user:${userId}` : `ip:${ip}`
        const limit = 100
        const window = 60 // 1 minute

        try {
            const result = await rateLimit({ uniqueToken: identifier, limit, window })

            if (!result.success) {
                return new NextResponse('Too Many Requests', {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': result.remaining.toString(),
                        'X-RateLimit-Reset': new Date(result.reset).toUTCString(),
                        'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString()
                    }
                })
            }

            // Add headers to successful response too
            const response = await handler(req, context)
            response.headers.set('X-RateLimit-Limit', limit.toString())
            response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
            return response

        } catch (error) {
            console.error('Rate Limit Error:', error)
            // Fail open or closed? Closed for security.
            return new NextResponse('Internal Server Error', { status: 500 })
        }
    }
}
