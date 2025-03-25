import Image from "next/image"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SignUpModal } from "@/components/ui/sign-up-modal"
import { FeaturedRecipeCard } from "@/components/ui/featured-recipe"
import { EventCard } from "@/components/ui/event-card"

export default function HomePage() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Discover the Joy of Cooking with TheRecipe
              </h1>
              <p className="max-w-[600px] text-green-600 dark:text-green-300 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
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
                src="/college-cooking.jpg"
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

      <SignUpModal />
    </>
  )
}

