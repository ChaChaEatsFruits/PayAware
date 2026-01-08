
import { PaymentGenerator } from './payment-generator'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ShieldCheck } from 'lucide-react'

export default function PaymentsPage() {
    return (
        <div className="flex flex-col space-y-8 p-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Make a Payment</h1>
                <p className="text-muted-foreground">Securely initiate UPI payments via your preferred app.</p>
            </div>

            <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300">Safe & Secure</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                    PayAware does <span className="font-bold">not</span> process money. We generate a standard UPI link that opens your banking app (Google Pay, PhonePe, etc.) to complete the transaction safely.
                </AlertDescription>
            </Alert>

            <div className="grid gap-8">
                <PaymentGenerator />
            </div>
        </div>
    )
}
