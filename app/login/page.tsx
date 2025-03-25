"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ChefHat } from "lucide-react"
import { toast } from "sonner"
import { FaGoogle, FaFacebook } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<'login' | 'social'>('login')
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Email and password are required")
      return
    }

    setLoading(true)

    try {
      const response = await apiClient.auth.login(email, password)

      if (response.error) {
        toast.error(response.message || response.error)
        return
      }

      // Store auth data
      login(response.token, response.user)

      toast.success("You have successfully logged in!", {
        description: "Welcome back, chef! Let's cook up something amazing.",
        icon: <ChefHat className="text-green-600" />
      })

      // Redirect to dashboard
      router.push("/")
    } catch (e) {
      const error = e as Error
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12 flex items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 opacity-20 -z-10 animate-pulse"></div>

        {/* Login Header */}
        <div className="flex flex-col space-y-2 text-center p-6 bg-green-50 dark:bg-green-900/30">
          <Image 
            src="/recipe-logo.png" 
            alt="TheRecipe Logo" 
            width={64} 
            height={64} 
            className="mx-auto mb-4 animate-bounce"
          />
          <h1 className="text-3xl font-bold tracking-tight text-green-800 dark:text-green-200">
            Welcome Back, Chef!
          </h1>
          <p className="text-sm text-green-600 dark:text-green-300">
            {activeSection === 'login' 
              ? "Enter your credentials to sign in" 
              : "Or continue with a social account"}
          </p>
        </div>

        {/* Login Form */}
        <div className="grid gap-6 p-6">
          {activeSection === 'login' ? (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-green-700 dark:text-green-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-green-300 focus:ring-green-500"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-green-700 dark:text-green-300">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-green-600 underline-offset-4 hover:underline"
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
                      className="border-green-300 focus:ring-green-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-green-600 hover:text-green-800"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid gap-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 text-green-700 border-green-300 hover:bg-green-50"
                onClick={() => toast.info("Google login coming soon!")}
              >
                <FaGoogle className="h-5 w-5" /> Continue with Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 text-green-700 border-green-300 hover:bg-green-50"
                onClick={() => toast.info("Facebook login coming soon!")}
              >
                <FaFacebook className="h-5 w-5" /> Continue with Facebook
              </Button>
            </div>
          )}

          {/* Section Toggle */}
          <div className="text-center text-sm mt-4">
            {activeSection === 'login' ? (
              <>
                Don&apos;t have an account?{" "}
                <Link 
                  href="/register" 
                  className="text-green-600 underline underline-offset-4 hover:text-green-800"
                >
                  Sign up
                </Link>
                {" | "}
                <button 
                  onClick={() => setActiveSection('social')}
                  className="text-green-600 underline underline-offset-4 hover:text-green-800"
                >
                  Social Login
                </button>
              </>
            ) : (
              <button 
                onClick={() => setActiveSection('login')}
                className="text-green-600 underline underline-offset-4 hover:text-green-800"
              >
                Back to Email Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
