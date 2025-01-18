import * as React from "react"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: 'default' | 'success' | 'error' | 'warning'
  onClose: () => void
}

const variantClasses = {
  default: "bg-white/10",
  success: "bg-green-500/20",
  error: "bg-red-500/20",
  warning: "bg-yellow-500/20",
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`pointer-events-auto flex w-full max-w-md rounded-full backdrop-filter backdrop-blur-3xl transition-all duration-300 ease-in-out px-2 ${variantClasses[variant]} ${className}`}
        {...props}
      >
        <div className="flex-1 p-2 text-xs text-neutral-300">{children}</div>
        <button
          onClick={onClose}
          className="flex items-center justify-center p-2 opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    )
  }
)
Toast.displayName = "Toast"

