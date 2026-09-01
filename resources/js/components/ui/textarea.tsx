import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-xl border border-[var(--grey)] bg-[var(--grey)]/10 px-4 py-3 text-base shadow-sm placeholder:text-[var(--grey)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--grey)]/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  } 
)
Textarea.displayName = "Textarea"

export { Textarea }
