import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SignUpModal } from "@/components/ui/sign-up-modal"
import { CookieConsent } from "@/components/ui/cookie-consent"
import { FeaturedRecipeCard } from "@/components/ui/featured-recipe"
import { EventCard } from "@/components/ui/event-card"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/placeholder.svg?height=32&width=32" alt="FoodFusion Logo" width={32} height={32} />
              <span className="text-xl font-bold">FoodFusion</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                About Us
              </Link>
              <Link
                href="/recipes"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Recipes
              </Link>
              <Link
                href="/community"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Community
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Contact
              </Link>
              <Link
                href="/culinary-resources"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Culinary Resources
              </Link>
              <Link
                href="/educational-resources"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Educational Resources
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Login
            </Link>
            <Button asChild size="sm">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Discover the Joy of Cooking with FoodFusion
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our vibrant community of food enthusiasts. Share recipes, learn new techniques, and explore
                  culinary creativity.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg">
                    Join Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Explore Recipes
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] aspect-video overflow-hidden rounded-xl">
                <Image
                  src="/placeholder.svg?height=500&width=800"
                  alt="Cooking collage"
                  width={800}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Recipes</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover our most popular and seasonal recipes
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <FeaturedRecipeCard
                title="Creamy Garlic Pasta"
                image="/placeholder.svg?height=300&width=400"
                difficulty="Easy"
                time="30 min"
                rating={4.8}
              />
              <FeaturedRecipeCard
                title="Spicy Thai Curry"
                image="/placeholder.svg?height=300&width=400"
                difficulty="Medium"
                time="45 min"
                rating={4.6}
              />
              <FeaturedRecipeCard
                title="Classic Apple Pie"
                image="/placeholder.svg?height=300&width=400"
                difficulty="Medium"
                time="90 min"
                rating={4.9}
              />
            </div>
            <div className="flex justify-center mt-8">
              <Button variant="outline">View All Recipes</Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Upcoming Cooking Events</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our virtual and in-person cooking classes and events
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <EventCard
                title="Italian Pasta Masterclass"
                image="/placeholder.svg?height=200&width=300"
                date="April 15, 2025"
                time="6:00 PM - 8:00 PM"
                location="Virtual"
              />
              <EventCard
                title="Baking Fundamentals"
                image="/placeholder.svg?height=200&width=300"
                date="April 22, 2025"
                time="5:30 PM - 7:30 PM"
                location="Virtual"
              />
              <EventCard
                title="Farm to Table Cooking"
                image="/placeholder.svg?height=200&width=300"
                date="May 5, 2025"
                time="11:00 AM - 2:00 PM"
                location="Urban Farm, Downtown"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6 md:py-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/placeholder.svg?height=32&width=32" alt="FoodFusion Logo" width={32} height={32} />
              <span className="text-xl font-bold">FoodFusion</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FoodFusion. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">
              Cookie Policy
            </Link>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary">
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
            <Link href="#" className="text-muted-foreground hover:text-primary">
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
            <Link href="#" className="text-muted-foreground hover:text-primary">
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
      <SignUpModal />
      <CookieConsent />
    </div>
  )
}

