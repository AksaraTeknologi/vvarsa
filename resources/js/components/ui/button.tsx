import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-bold transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-black/10 dark:focus-visible:ring-white/10",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--purple)] text-white shadow-[0_4px_14px_0_rgba(94,75,242,0.3)] hover:opacity-90",
        save:
          "bg-[var(--lime)] text-[var(--white)] shadow-[0_4px_14px_0_rgba(114,225,92,0.35)] hover:opacity-95",
        edit:
          "bg-[var(--cyber-yellow)] text-[var(--white)] shadow-[0_4px_14px_0_rgba(255,210,0,0.3)] hover:opacity-95",
        secondary:
          "bg-[var(--white-lavender)] text-[var(--black)] hover:bg-gray-100 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)]",
        dark: 
          "bg-[var(--black)] text-white hover:bg-black/90 shadow-[0_4px_14px_0_rgba(31,34,43,0.2)]",
        destructive:
          "bg-[var(--coral-red)] text-white shadow-[0_4px_14px_0_rgba(255,82,82,0.3)] hover:opacity-90",
        outline:
          "border-2 border-[var(--black)] bg-transparent text-[var(--black)] hover:bg-[var(--black)] hover:text-white",
        ghost: "hover:bg-[var(--white-lavender)] text-[var(--black)]",
        link: "text-[var(--purple)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 px-8 py-3",
        sm: "h-10 px-5 text-sm",
        lg: "h-16 px-10 text-lg tracking-wide",
        icon: "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
