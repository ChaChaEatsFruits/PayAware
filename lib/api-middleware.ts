
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type RouteHandler = (req: NextRequest, context: any) => Promise<NextResponse>

export function withSecurity(handler: RouteHandler, options: { protected: boolean } = { protected: true }) {
    return async (req: NextRequest, context: any) => {
        // Auth Check (if protected)
        if (options.protected) {
            const supabase = await createClient()
            const { data: { user }, error } = await supabase.auth.getUser()

            if (error || !user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
        }

        // Execute the handler
        return handler(req, context)
    }
}
