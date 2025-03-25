/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Printer, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { apiClient } from "@/lib/api-client"

interface SharedRecipePageProps {
  params: {
    token: string
  }
}

export default function SharedRecipePage({ params }: SharedRecipePageProps) {
  const [recipe, setRecipe] = useState<any>(null)
  const [sharedBy, setSharedBy] = useState<any>(null)
  const [sharedAt, setSharedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSharedRecipe = async () => {
      try {
        const data = await apiClient.recipes.getShared(params.token)

        setRecipe(data.recipe)
        setSharedBy(data.sharedBy)
        setSharedAt(data.sharedAt)
      } catch (err) {
        setError("This shared recipe link is invalid or has expired")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSharedRecipe()
  }, [params.token])

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading shared recipe...</p>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Error</h2>
          <p className="text-muted-foreground">{error || "Recipe not found"}</p>
          <Button asChild className="mt-4">
            <Link href="/recipes">Browse Recipes</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <Alert className="mb-6">
        <AlertTitle>Shared Recipe</AlertTitle>
        <AlertDescription>
          This recipe was shared with you by {sharedBy?.firstName} {sharedBy?.lastName} on{" "}
          {new Date(sharedAt || "").toLocaleDateString()}.
        </AlertDescription>
      </Alert>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link href="/recipes" className="text-sm text-muted-foreground hover:text-primary">
                  Recipes
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="text-sm text-muted-foreground">{recipe.category?.name || "Shared Recipe"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Printer className="h-4 w-4" />
                  <span className="sr-only">Print recipe</span>
                </Button>
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{recipe.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{recipe.cookingTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">{recipe.difficulty}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">By</span>
              <span className="text-sm font-medium">
                {recipe.author?.firstName} {recipe.author?.lastName}
              </span>
            </div>
          </div>

          <div className="aspect-video relative rounded-lg overflow-hidden">
            <Image
              src={recipe.imageUrl || "/placeholder.svg?height=600&width=800"}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-lg text-muted-foreground">{recipe.description}</p>
          </div>

          <Tabs defaultValue="instructions">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            </TabsList>

            <TabsContent value="instructions" className="space-y-4 mt-6">
              {typeof recipe.instructions === "string" ? (
                <div className="whitespace-pre-line">{recipe.instructions}</div>
              ) : (
                <ol className="space-y-4 list-decimal list-inside">
                  {recipe.instructions.map((instruction: string, index: number) => (
                    <li key={index} className="pl-2">
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              )}
            </TabsContent>

            <TabsContent value="ingredients" className="space-y-4 mt-6">
              {typeof recipe.ingredients === "string" ? (
                <div className="whitespace-pre-line">{recipe.ingredients}</div>
              ) : (
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Join the Conversation</h3>
            <p className="text-muted-foreground">
              Create an account or log in to comment on this recipe and connect with other food enthusiasts.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold">Discover More Recipes</h3>
            <p className="text-sm text-muted-foreground">
              Join FoodFusion to explore thousands of recipes and connect with a community of food enthusiasts.
            </p>
            <Button className="w-full" asChild>
              <Link href="/register">Join FoodFusion</Link>
            </Button>
          </div>

          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold">Popular Categories</h3>
            <div className="space-y-2">
              {["Quick & Easy", "Vegetarian", "Desserts", "Healthy", "Comfort Food"].map((category, i) => (
                <Link
                  key={i}
                  href={`/recipes?category=${category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block p-2 hover:bg-muted rounded-md transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-4">
              <h3 className="font-bold">About FoodFusion</h3>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-sm">
                FoodFusion is a culinary platform dedicated to promoting home cooking and culinary creativity among food
                enthusiasts.
              </p>
              <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

