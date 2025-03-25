"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null)
  const router = useRouter()
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLocked) {
      const now = new Date()
      if (lockoutTime && now < lockoutTime) {
        const remainingSeconds = Math.ceil((lockoutTime.getTime() - now.getTime()) / 1000)
        toast(`Too many failed attempts. Try again in ${remainingSeconds} seconds.`)
        return
      } else {
        // Reset lockout if time has passed
        setIsLocked(false)
        setFailedAttempts(0)
      }
    }

    if (!email || !password) {
      toast("Email and password are required")
      return
    }

    setLoading(true)

    try {
      // In a real app, this would be an API call to authenticate the user
      // For now, we'll simulate a login with a dummy credential check
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Dummy credential check (in a real app, this would be server-side)
      if (email === "user@example.com" && password === "password123") {
        toast("You have successfully logged in!")

        // Redirect to dashboard
        router.push("/")
      } else {
        // Increment failed attempts
        const newFailedAttempts = failedAttempts + 1
        setFailedAttempts(newFailedAttempts)

        // Check if account should be locked
        if (newFailedAttempts >= 3) {
          setIsLocked(true)
          const lockoutEndTime = new Date()
          lockoutEndTime.setMinutes(lockoutEndTime.getMinutes() + 3) // Lock for 3 minutes
          setLockoutTime(lockoutEndTime)

          toast("Too many failed attempts. Your account is locked for 3 minutes.")
        } else {
          toast(`Invalid credentials. ${3 - newFailedAttempts} attempts remaining.`)
        }
      }
    } catch (e) {
      const error = e as Error
      toast(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
        </div>
        <div className="grid gap-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading || isLocked}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

