"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookiesAccepted")
    if (!hasAccepted) {
      setShowConsent(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true")
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background border-t shadow-lg">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{" "}
          <Link href="/cookies" className="underline underline-offset-4 hover:text-primary">
            Learn more
          </Link>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowConsent(false)}>
            Decline
          </Button>
          <Button size="sm" onClick={acceptCookies}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}

