import type React from "react"
import { Inter } from "next/font/google"
import { SonnerProvider } from "@/components/ui/sonner-provider"
import { AuthProvider } from "@/lib/auth-context"
import { CookieConsent } from "@/components/ui/cookie-consent"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/ui/navbar"
import "./globals.css"
import { ThemeProvider } from "next-themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TheRecipe - Malawi Platform",
  description: "A hub for sharing recipes, culinary tips, and fostering a vibrant food community",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 p-6 md:py-12">{children}</main>
              <footer className="w-full border-t bg-background py-6 p- md:py-12 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40">
                <div className="container flex flex-col items-center justify-between p-6 gap-4 md:flex-row">
                  <div className="flex flex-col items-center gap-4 md:items-start">
                    <Link href="/" className="flex items-center gap-2">
                      <Image src="/recipe-logo.png" alt="TheRecipe Logo" width={32} height={32} />
                      <span className="text-xl font-bold text-green-800 dark:text-green-200">TheRecipe</span>
                    </Link>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      &copy; {new Date().getFullYear()} TheRecipe. All rights reserved.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Link href="/privacy" className="text-sm text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100">
                      Privacy Policy
                    </Link>
                    <Link href="/terms" className="text-sm text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100">
                      Terms of Service
                    </Link>
                    <Link href="/cookies" className="text-sm text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100">
                      Cookie Policy
                    </Link>
                  </div>
                  <div className="flex gap-4">
                    <Link href="#" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                      <span className="sr-only">Facebook</span>
                    </Link>
                    <Link href="#" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                      <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href="#" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                      <span className="sr-only">Twitter</span>
                    </Link>
                  </div>
                </div>
              </footer>
              <CookieConsent />
            </div>
            <SonnerProvider />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
