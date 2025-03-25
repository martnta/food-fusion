"use client"

import { Toaster as SonnerToaster } from "sonner"

export function SonnerProvider() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className: "sonner-toast",
        duration: 3000,
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "var(--radius)",
        },
      }}
    />
  )
}

