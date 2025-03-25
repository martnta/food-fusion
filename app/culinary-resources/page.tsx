import Image from "next/image"
import { Download, ExternalLink, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CulinaryResourcesPage() {
  return (
    <div className="container py-12">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Culinary Resources</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
          Downloadable recipe cards, cooking tutorials, and instructional videos on various cooking techniques
        </p>
      </div>

      <Tabs defaultValue="recipe-cards" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recipe-cards">Recipe Cards</TabsTrigger>
          <TabsTrigger value="tutorials">Cooking Tutorials</TabsTrigger>
          <TabsTrigger value="techniques">Kitchen Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="recipe-cards" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt={`Recipe card ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <h3 className="text-lg font-bold">
                    {
                      [
                        "Classic Chocolate Chip Cookies",
                        "Easy Weeknight Chicken Curry",
                        "Perfect Fluffy Pancakes",
                        "Homemade Pizza Dough",
                        "Quick Vegetable Stir Fry",
                        "Simple Tomato Pasta Sauce",
                      ][i]
                    }
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {
                      [
                        "A timeless recipe for soft and chewy chocolate chip cookies that everyone will love.",
                        "A flavorful curry that comes together in just 30 minutes for busy weeknights.",
                        "The secret to making light and fluffy pancakes every single time.",
                        "Master the art of homemade pizza with this foolproof dough recipe.",
                        "A versatile stir fry recipe that works with whatever vegetables you have on hand.",
                        "A simple yet delicious tomato sauce that forms the base for countless pasta dishes.",
                      ][i]
                    }
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=200&width=350"
                    alt={`Tutorial ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-background/80 p-3">
                      <Play className="h-6 w-6 fill-primary text-primary" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <h3 className="text-lg font-bold">
                    {
                      [
                        "Knife Skills 101",
                        "Baking Bread from Scratch",
                        "Mastering Pasta Making",
                        "Perfect Steak Every Time",
                        "Vegetable Prep Techniques",
                        "Sauce Fundamentals",
                      ][i]
                    }
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {
                      [
                        "Learn the essential knife skills every home cook should know for safer and more efficient cooking.",
                        "A comprehensive guide to making artisanal bread at home with minimal equipment.",
                        "From basic pasta dough to shaping techniques, learn how to make fresh pasta from scratch.",
                        "Discover the secrets to cooking the perfect steak using various methods and cuts.",
                        "Time-saving techniques for prepping vegetables that will streamline your cooking process.",
                        "Master the five mother sauces and learn how to adapt them for countless variations.",
                      ][i]
                    }
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Tutorial
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="techniques" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=200&width=200"
                        alt={`Technique ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="text-lg font-bold mb-2">
                      {["Blanching Vegetables", "Deglazing a Pan", "Tempering Chocolate", "Folding Techniques"][i]}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {
                        [
                          "Learn how to blanch vegetables to preserve their color, texture, and nutrients for salads and other dishes.",
                          "Master the art of deglazing to create flavorful pan sauces that elevate any dish.",
                          "Discover the secrets to perfectly tempered chocolate for glossy, snappy chocolate creations.",
                          "Perfect the gentle folding technique essential for maintaining volume in delicate batters and mixtures.",
                        ][i]
                      }
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        PDF Guide
                      </Button>
                      <Button size="sm">
                        <Play className="mr-2 h-4 w-4" />
                        Watch Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
            <h3 className="text-xl font-bold mb-4">Advanced Techniques Course</h3>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=350"
                    alt="Advanced Techniques Course"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground mb-4">
                  Take your cooking skills to the next level with our comprehensive advanced techniques course. Learn
                  professional methods used in top restaurants around the world.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">20+ Video Lessons</span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    Downloadable Resources
                  </span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    Certificate of Completion
                  </span>
                </div>
                <Button>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Enroll Now
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

