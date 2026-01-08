import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        if (body.message.type === 'tool-calls') {
            const toolCall = body.message.toolCalls[0]
            const functionName = toolCall.function.name

            if (functionName === 'logTransaction') {
                // 1. Parse Arguments
                let args = toolCall.function.arguments;
                if (typeof args === 'string') {
                    args = JSON.parse(args);
                }
                const { amount, type, category, description } = args;

                // 2. Extract User ID
                const callObj = body.message.call;
                const userId = callObj?.assistantOverrides?.metadata?.userId || callObj?.metadata?.userId;

                if (!userId) {
                    return NextResponse.json({
                        results: [{ toolCallId: toolCall.id, result: "Error: User ID not found." }]
                    });
                }

                // 3. Create Admin Client
                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
                );

                // --- NEW: BALANCE VALIDATION LOGIC ---
                if (type === 'expense') {
                    // Fetch all existing transactions for this user to calculate balance
                    const { data: transactions, error: fetchError } = await supabaseAdmin
                        .from('transactions')
                        .select('amount, type')
                        .eq('user_id', userId);

                    if (fetchError) {
                        console.error("Balance Check Error:", fetchError);
                        return NextResponse.json({
                            results: [{ toolCallId: toolCall.id, result: "I couldn't check your balance due to a system error." }]
                        });
                    }

                    // Calculate current balance
                    const currentBalance = (transactions || []).reduce((acc, t) => {
                        const val = Number(t.amount);
                        return t.type === 'income' ? acc + val : acc - val;
                    }, 0);

                    // Check if expense exceeds balance
                    if (currentBalance - Number(amount) < 0) {
                        return NextResponse.json({
                            results: [{
                                toolCallId: toolCall.id,
                                // The AI will read this exact message to the user
                                result: `Transaction failed. You only have ${currentBalance} rupees available, but you tried to spend ${amount}.`
                            }]
                        });
                    }
                }
                // --- END VALIDATION ---

                // 4. Insert Transaction (Only if validation passed)
                const { error } = await supabaseAdmin.from('transactions').insert([
                    {
                        amount: amount,
                        type: type,
                        category: category,
                        description: description,
                        user_id: userId,
                        is_confirmed: true
                    }
                ])

                if (error) {
                    console.error("Supabase Error:", error);
                    return NextResponse.json({
                        results: [{ toolCallId: toolCall.id, result: "Database error. Check your server logs." }]
                    });
                }

                revalidatePath('/dashboard')

                return NextResponse.json({
                    results: [
                        {
                            toolCallId: toolCall.id,
                            result: `Done. I've logged ${amount} rupees for ${description}.`
                        }
                    ]
                })
            }
        }

        return NextResponse.json({});

    } catch (error) {
        console.error('Vapi error', error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}