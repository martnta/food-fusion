import Image from "next/image"
import { Clock, Heart, MessageCircle, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CommunityPage() {
  return (
    <div className="container py-12">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Community Cookbook</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
          A collaborative space where members share their favorite recipes, cooking tips, and culinary experiences
        </p>
      </div>

      <Tabs defaultValue="recent" className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <Button>Share Your Recipe</Button>
        </div>

        <TabsContent value="recent" className="space-y-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-4 flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback>{["JD", "AS", "MC", "EW", "TP"][i]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {["John Doe", "Alice Smith", "Mike Chen", "Emma Wilson", "Tom Parker"][i]}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Posted {["2 hours", "1 day", "3 days", "1 week", "2 weeks"][i]} ago
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <Image src="/placeholder.svg?height=400&width=800" alt="Recipe image" fill className="object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-bold">
                    {
                      [
                        "Homemade Sourdough Bread",
                        "Grandma's Secret Chocolate Cake",
                        "Quick Weeknight Pasta",
                        "Summer Berry Smoothie Bowl",
                        "Spicy Vegetable Curry",
                      ][i]
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {
                      [
                        "After years of perfecting my technique, I'm excited to share my sourdough recipe that yields a perfect crust and chewy interior every time.",
                        "This chocolate cake recipe has been in my family for generations. The secret ingredient? A touch of cinnamon!",
                        "A simple pasta dish that comes together in just 15 minutes - perfect for busy weeknights when you don't have time to cook.",
                        "Start your day with this nutritious and Instagram-worthy smoothie bowl packed with antioxidants and flavor.",
                        "My take on a traditional vegetable curry with a spicy kick. Adjust the heat level to your preference!",
                      ][i]
                    }
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{["3 hours", "45 minutes", "15 minutes", "10 minutes", "40 minutes"][i]}</span>
                    <span className="mx-1">•</span>
                    <span>{["Intermediate", "Easy", "Beginner", "Easy", "Intermediate"][i]}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 flex justify-between">
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{[124, 87, 56, 42, 93][i]}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{[18, 12, 5, 3, 14][i]}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  View Full Recipe
                </Button>
              </CardFooter>
            </Card>
          ))}

          <div className="flex justify-center mt-8">
            <Button variant="outline">Load More</Button>
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Switch to the &quot;Popular&quot; tab to see the most liked and commented recipes from our community.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="following" className="space-y-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Follow your favorite chefs to see their latest recipes here.</p>
            <Button className="mt-4">Discover Chefs to Follow</Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Community Highlights</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold">Chef of the Month</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Chef of the Month" />
                  <AvatarFallback>CM</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Maria Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Specializes in Mediterranean cuisine</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Maria has contributed over 50 recipes to our community and has received the highest ratings this month!
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold">Recipe Challenge</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video relative rounded-md overflow-hidden">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Recipe Challenge"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-medium">Summer Desserts Challenge</div>
                <div className="text-sm text-muted-foreground">Ends in 5 days</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Create and share your best summer dessert recipe for a chance to win cooking equipment and be featured
                on our homepage!
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Join Challenge
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold">Upcoming Events</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border-b pb-3">
                  <div className="font-medium">Virtual Cooking Class: Pasta Making</div>
                  <div className="text-sm text-muted-foreground">April 15, 2025 • 6:00 PM</div>
                </div>
                <div className="border-b pb-3">
                  <div className="font-medium">Community Potluck</div>
                  <div className="text-sm text-muted-foreground">April 22, 2025 • 12:00 PM</div>
                </div>
                <div>
                  <div className="font-medium">Cookbook Launch Party</div>
                  <div className="text-sm text-muted-foreground">May 5, 2025 • 7:00 PM</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Events
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

