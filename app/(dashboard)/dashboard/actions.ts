
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const TransactionSchema = z.object({
    amount: z.coerce.number().positive(),
    type: z.enum(['income', 'expense']),
    category: z.string().min(1),
    description: z.string().optional(),
})

export async function addTransaction(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const rawData = {
        amount: formData.get('amount'),
        type: formData.get('type'),
        category: formData.get('category'),
        description: formData.get('description'),
    }

    const validatedFields = TransactionSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return { error: 'Invalid fields' }
    }

    const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        ...validatedFields.data,
        is_confirmed: true // User manually entering data implies confirmation
    })

    if (error) {
        console.error('Error adding transaction:', error)
        return { error: 'Failed to add transaction' }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function getBalance() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { balance: 0, income: 0, expense: 0 }

    const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', user.id)

    if (error || !transactions) return { balance: 0, income: 0, expense: 0 }

    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + Number(t.amount), 0)

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.amount), 0)

    return {
        balance: income - expense,
        income,
        expense
    }
}

export async function getRecentTransactions() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

    return transactions || []
}
