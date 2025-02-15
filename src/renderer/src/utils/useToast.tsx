import { Toast, ToastProps } from "@renderer/components/layout/toast"
import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"

type ToastType = Omit<ToastProps, "onClose">

interface ToastContextType {
  addToast: (toast: ToastType) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = React.useState<(ToastType & { id: string })[]>([])

  const addToast = React.useCallback((toast: ToastType) => {
    const id = Math.random().toString()
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])
    if (toast.fixed === "false") {
      setTimeout(() => {
        removeToast(id)
      }, 5000) // Remove toast after 5000ms
    }
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-4 max-h-screen overflow-hidden pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Toast {...toast} onClose={() => removeToast(toast.id)}>
              {toast.children}
            </Toast>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
