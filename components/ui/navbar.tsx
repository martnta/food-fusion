"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu } from "lucide-react"
import { AuthStatus } from "@/components/ui/auth-status"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home", active: true },
    { href: "/about", label: "About Us" },
    { href: "/recipes", label: "Recipes" },
    { href: "/community", label: "Community" },
    { href: "/contact", label: "Contact" },
    { href: "/culinary-resources", label: "Culinary Resources" },
    { href: "/educational-resources", label: "Educational Resources" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-green-50/95 to-green-100/95 dark:from-green-900/60 dark:to-green-800/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300 ease-in-out scroll-smooth">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/recipe-logo.png" alt="TheRecipe Logo" width={32} height={32} />
            <span className="text-xl font-bold text-green-800 dark:text-green-200">TheRecipe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  link.active ? "text-green-900 dark:text-green-100" : "text-green-700 dark:text-green-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <AuthStatus />

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col p-4 gap-6 py-6">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <Image src="/recipe-logo.png" alt="TheRecipe Logo" width={32} height={32} />
                  <span className="text-xl font-bold text-green-800 dark:text-green-200">TheRecipe</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        link.active ? "text-green-900 dark:text-green-100" : "text-green-700 dark:text-green-300"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
