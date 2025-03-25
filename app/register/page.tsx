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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<'register' | 'social'>('register')
  const router = useRouter()
  const { login } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error("All fields are required")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setLoading(true)

    try {
      const response = await apiClient.auth.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })

      if (response.error) {
        toast.error(response.error)
        return
      }

      // Store auth data
      login(response.token, response.user)

      toast.success("Your account has been created successfully!", {
        description: "Welcome to TheRecipe! Get ready to explore delicious recipes.",
        icon: <ChefHat className="text-green-600" />
      })

      // Redirect to home page
      router.push("/")
    } catch (e) {
      const error = e as Error
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12 flex items-center justify-center min-h-screen">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        {/* Image Section */}
        <div className="hidden md:block relative">
          <Image 
            src="/cooking-illustration.png" 
            alt="Cooking Illustration" 
            layout="fill" 
            objectFit="cover" 
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-green-900 opacity-50"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-8">
            <h2 className="text-3xl font-bold mb-4">Welcome to TheRecipe</h2>
            <p className="text-xl">
              Discover, Create, and Share Delicious Recipes
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="flex flex-col justify-center p-8 space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <Image 
              src="/recipe-logo.png" 
              alt="TheRecipe Logo" 
              width={64} 
              height={64} 
              className="mx-auto mb-4 animate-bounce"
            />
            <h1 className="text-3xl font-bold tracking-tight text-green-800 dark:text-green-200">
              {activeSection === 'register' ? 'Create Your Account' : 'Join with Social'}
            </h1>
            <p className="text-sm text-green-600 dark:text-green-300">
              {activeSection === 'register' 
                ? "Enter your details to start your culinary journey" 
                : "Connect with your favorite social platform"}
            </p>
          </div>

          <div className="grid gap-6">
            {activeSection === 'register' ? (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName" className="text-green-700 dark:text-green-300">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="border-green-300 focus:ring-green-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName" className="text-green-700 dark:text-green-300">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="border-green-300 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-green-700 dark:text-green-300">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-green-300 focus:ring-green-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-green-700 dark:text-green-300">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
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
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" className="text-green-700 dark:text-green-300">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="border-green-300 focus:ring-green-500"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white" 
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid gap-4">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 text-green-700 border-green-300 hover:bg-green-50"
                  onClick={() => toast.info("Google signup coming soon!")}
                >
                  <FaGoogle className="h-5 w-5" /> Continue with Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 text-green-700 border-green-300 hover:bg-green-50"
                  onClick={() => toast.info("Facebook signup coming soon!")}
                >
                  <FaFacebook className="h-5 w-5" /> Continue with Facebook
                </Button>
              </div>
            )}

            {/* Section Toggle */}
            <div className="text-center text-sm mt-4">
              {activeSection === 'register' ? (
                <>
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="text-green-600 underline underline-offset-4 hover:text-green-800"
                  >
                    Sign in
                  </Link>
                  {" | "}
                  <button 
                    onClick={() => setActiveSection('social')}
                    className="text-green-600 underline underline-offset-4 hover:text-green-800"
                  >
                    Social Signup
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setActiveSection('register')}
                  className="text-green-600 underline underline-offset-4 hover:text-green-800"
                >
                  Back to Email Registration
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
