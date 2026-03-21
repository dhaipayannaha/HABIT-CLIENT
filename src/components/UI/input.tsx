import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-14 w-full rounded-md border border-input bg-transparent px-3 py-1",
        "transition-all duration-200", // Add smooth transition
        "hover:border-indigo-400 hover:bg-slate-50/50", // Add hover effect
        "focus-visible:ring-2 focus-visible:ring-indigo-500", // Add focus color
        className
      )}
      {...props}
    />
  )
}

export { Input }
