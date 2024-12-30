import { toast as showToast } from "@/components/ui/use-toast"
import { ToastActionElement } from "@/components/ui/toast"

interface ToastOptions {
  title?: string
  description?: string
  duration?: number
  variant?: "default" | "destructive"
  action?: ToastActionElement
}

export const toast = {
  success: (options: Omit<ToastOptions, "variant">) => {
    showToast({
      title: options.title,
      description: options.description,
      duration: options.duration || 3000,
    })
  },

  error: (options: Omit<ToastOptions, "variant">) => {
    showToast({
      title: options.title,
      description: options.description,
      duration: options.duration || 5000,
      variant: "destructive",
    })
  },

  info: (options: Omit<ToastOptions, "variant">) => {
    showToast({
      title: options.title,
      description: options.description,
      duration: options.duration || 3000,
    })
  },

  custom: (options: ToastOptions) => {
    showToast({
      title: options.title,
      description: options.description,
      duration: options.duration || 3000,
      variant: options.variant,
    })
  },
} 