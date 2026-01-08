'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveUserProfile(formData: {
    name: string
    email: string
    monthlyBudget: number
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase.from('user_profiles').insert({
        user_id: user.id,
        name: formData.name,
        email: formData.email,
        monthly_budget: formData.monthlyBudget,
        onboarding_completed: true,
    })

    if (error) {
        console.error('Error saving profile:', error)
        return { error: 'Failed to save profile' }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function checkOnboardingStatus() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { completed: false, user: null }
    }

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .single()

    return {
        completed: profile?.onboarding_completed ?? false,
        user: user,
    }
}

export async function getUserProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    return profile
}
