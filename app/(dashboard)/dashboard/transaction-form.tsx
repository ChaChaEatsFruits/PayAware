
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Plus, IndianRupee } from 'lucide-react'

import { addTransaction } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

const formSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.coerce.number().min(0.01, { message: "Amount must be positive" }),
    category: z.string().min(1, { message: "Please select a category" }),
    description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function TransactionForm() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: 'expense',
            amount: 0,
            category: 'Food',
            description: '',
        },
    })

    async function onSubmit(values: FormValues) {
        setLoading(true)
        const formData = new FormData()
        formData.append('type', values.type)
        formData.append('amount', values.amount.toString())
        formData.append('category', values.category)
        if (values.description) {
            formData.append('description', values.description)
        }

        const result = await addTransaction(formData)
        setLoading(false)

        if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
            })
        } else {
            toast({
                title: "Success",
                description: "Transaction logged successfully",
            })
            form.reset({
                type: 'expense',
                amount: 0,
                category: 'Food',
                description: '',
            })
        }
    }

    return (
        <Card className="h-full border-none shadow-none md:border md:shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Log Transaction
                </CardTitle>
                <CardDescription>
                    Add a new income or expense entry.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Transaction Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="income" className="text-green-600 font-medium">Income</SelectItem>
                                            <SelectItem value="expense" className="text-red-600 font-medium">Expense</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount (INR)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                className="pl-9"
                                                defaultValue={""}
                                                min={""}
                                                step={0.01}
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Food">Food & Dining</SelectItem>
                                            <SelectItem value="Travel">Travel & Transport</SelectItem>
                                            <SelectItem value="Salary">Salary & Wages</SelectItem>
                                            <SelectItem value="Utilities">Utilities & Bills</SelectItem>
                                            <SelectItem value="Entertainment">Entertainment</SelectItem>
                                            <SelectItem value="Shopping">Shopping</SelectItem>
                                            <SelectItem value="Health">Health & Wellness</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Lunch with team" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Optional note about this transaction.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Transaction
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
