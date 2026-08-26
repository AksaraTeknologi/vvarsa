import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base classes: Bulat sempurna, font tebal, efek animasi klik (scale-95), transisi halus
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-bold transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-[#1a56ff]/50",
  {
    variants: {
      variant: {
        // Tombol aksi utama (Warna Biru Unipay)
        default:
          "bg-[#1a56ff] text-white shadow-[0_4px_14px_0_rgba(26,86,255,0.3)] hover:bg-[#1545cc]",
        // Tombol aksi di atas background putih (seperti di Bottom Sheet)
        secondary:
          "bg-white text-black hover:bg-gray-100 shadow-[0_4px_14px_0_rgba(0,0,0,0.05)]",
        // Tombol kapsul gelap (seperti tombol Withdraw/Deposit)
        dark: 
          "bg-[#1c1c1e] text-white hover:bg-[#2c2c2e]",
        // Tombol destruktif/hapus
        destructive:
          "bg-red-500 text-white shadow-[0_4px_14px_0_rgba(239,68,68,0.3)] hover:bg-red-600",
        // Tombol outline (Garis luar transparan)
        outline:
          "border-2 border-[#1c1c1e] bg-transparent text-white hover:bg-[#1c1c1e]",
        // Tombol tanpa background
        ghost: "hover:bg-[#1c1c1e] text-white",
        // Tombol gaya link teks
        link: "text-[#1a56ff] underline-offset-4 hover:underline",
      },
      size: {
        // Ukuran dibuat lebih "chunky" agar ramah untuk sentuhan jari (Mobile first)
        default: "h-14 px-8 py-2",
        sm: "h-10 px-6 text-sm",
        lg: "h-16 px-10 text-lg",
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