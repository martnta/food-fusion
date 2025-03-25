import Image from "next/image"
import { Download, FileText, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EducationalResourcesPage() {
  return (
    <div className="container py-12">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Educational Resources</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
          Downloadable resources, infographics, and videos on renewable energy topics
        </p>
      </div>

      <Tabs defaultValue="infographics" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="infographics">Infographics</TabsTrigger>
          <TabsTrigger value="guides">Guides & Articles</TabsTrigger>
          <TabsTrigger value="videos">Educational Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="infographics" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image
                    src="/placeholder.svg?height=400&width=300"
                    alt={`Infographic ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <h3 className="text-lg font-bold">
                    {
                      [
                        "Seasonal Produce Guide",
                        "Cooking Temperatures Chart",
                        "Herb & Spice Pairing Guide",
                        "Meat Cuts Explained",
                        "Measurement Conversions",
                        "Food Storage Guidelines",
                      ][i]
                    }
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {
                      [
                        "A comprehensive guide to what fruits and vegetables are in season throughout the year.",
                        "Essential cooking and food safety temperatures for various meats and dishes.",
                        "Learn which herbs and spices pair best with different ingredients and cuisines.",
                        "A visual guide to different cuts of beef, pork, lamb, and chicken.",
                        "Quick reference for converting between metric and imperial measurements in cooking.",
                        "How to properly store different types of food to maximize freshness and minimize waste.",
                      ][i]
                    }
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Infographic
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guides" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <div className="aspect-square relative">
                      <Image
                        src="/placeholder.svg?height=200&width=200"
                        alt={`Guide ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="text-lg font-bold mb-2">
                      {
                        [
                          "Beginner's Guide to Meal Prepping",
                          "Understanding Food Labels",
                          "Sustainable Cooking Practices",
                          "Nutrition Basics for Home Cooks",
                        ][i]
                      }
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {
                        [
                          "Learn how to efficiently plan, prepare, and store meals for the week to save time and reduce food waste.",
                          "A comprehensive guide to decoding nutrition facts, ingredient lists, and health claims on food packaging.",
                          "Practical tips for reducing your environmental impact through sustainable cooking and shopping practices.",
                          "Essential nutrition information to help you create balanced, healthy meals for you and your family.",
                        ][i]
                      }
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Read Article
                      </Button>
                      <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <h3 className="text-lg font-bold">
                    {
                      ["Cooking Methods Explained", "Flavor Profiles Around the World", "Food Science for Home Cooks"][
                        i
                      ]
                    }
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {
                      [
                        "A detailed exploration of different cooking methods and when to use each for optimal results.",
                        "Discover the characteristic flavor profiles of cuisines from around the world and how to recreate them.",
                        "Learn the science behind cooking techniques and how they affect flavor, texture, and appearance.",
                      ][i]
                    }
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Read Full Guide
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/placeholder.svg?height=200&width=350"
                    alt={`Video ${i + 1}`}
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
                        "The Science of Baking",
                        "Understanding Flavor Combinations",
                        "Cooking with Seasonal Ingredients",
                        "Food Preservation Techniques",
                        "Sustainable Seafood Guide",
                        "Plant-Based Cooking Fundamentals",
                      ][i]
                    }
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {
                      [
                        "Explore the chemistry behind baking and how ingredients interact to create different textures and flavors.",
                        "Learn the principles behind successful flavor combinations and how to create balanced dishes.",
                        "Discover the benefits of cooking with seasonal ingredients and how to make the most of what's available.",
                        "Traditional and modern techniques for preserving food, from fermentation to canning and freezing.",
                        "A guide to making environmentally responsible seafood choices and supporting sustainable fishing practices.",
                        "Master the fundamentals of plant-based cooking and learn to create satisfying meals without animal products.",
                      ][i]
                    }
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Video
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-16 border rounded-lg overflow-hidden">
        <div className="bg-muted p-6">
          <h2 className="text-2xl font-bold">Educational Resources Newsletter</h2>
          <p className="text-muted-foreground mt-2">
            Subscribe to our newsletter to receive the latest educational resources directly in your inbox.
          </p>
        </div>
        <div className="p-6 flex flex-col md:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button className="md:w-auto">Subscribe</Button>
        </div>
      </div>
    </div>
  )
}

