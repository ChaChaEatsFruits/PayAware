
// Simplified version of shadcn/ui toast
import { useState, useEffect } from "react"

export interface Toast {
    id: string
    title?: string
    description?: string
    action?: React.ReactNode
    variant?: "default" | "destructive"
}

type ToastProps = Toast

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

// In a real app this would be more complex with context
// For this rapid prototype, we will use a simple custom hook event emitter pattern if needed
// Or just replicate the shadcn use-toast structure roughly

import * as React from "react"

const listeners: Array<(state: any) => void> = []

let memoryState: any = { toasts: [] }

function dispatch(action: any) {
    memoryState = reducer(memoryState, action)
    listeners.forEach((listener) => {
        listener(memoryState)
    })
}

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            }
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t: any) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            }
        case "DISMISS_TOAST": {
            const { toastId } = action
            if (toastId) {
                // ... 
            }
            return {
                ...state,
                toasts: state.toasts.filter((t: any) => t.id !== toastId),
            }
        }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                }
            }
            return {
                ...state,
                toasts: state.toasts.filter((t: any) => t.id !== action.toastId),
            }
    }
}

export function useToast() {
    const [state, setState] = React.useState(memoryState)

    React.useEffect(() => {
        listeners.push(setState)
        return () => {
            const index = listeners.indexOf(setState)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }, [state])

    return {
        ...state,
        toast: ({ ...props }: Toast) => {
            const id = Math.random().toString(36).substr(2, 9)
            const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

            dispatch({
                type: "ADD_TOAST",
                toast: {
                    ...props,
                    id,
                    open: true,
                    onOpenChange: (open: boolean) => {
                        if (!open) dismiss()
                    },
                },
            })

            // Auto dismiss
            setTimeout(() => {
                dispatch({ type: "REMOVE_TOAST", toastId: id })
            }, 5000)

            return {
                id: id,
                dismiss,
                update: (props: Toast) =>
                    dispatch({
                        type: "UPDATE_TOAST",
                        toast: { ...props, id },
                    }),
            }
        },
        dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
    }
}
