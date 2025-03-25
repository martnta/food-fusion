"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Clock, Heart, Pencil, Printer, Star, Trash2, Users } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommentSection } from "@/components/ui/comment-section"
import { ShareRecipeModal } from "@/components/ui/share-recipe-modal"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface RecipePageProps {
  params: {
    id: string
  }
}

export default function RecipePage({ params }: RecipePageProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recipe, setRecipe] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await apiClient.recipes.getById(params.id)
        setRecipe(data)
        setFavoriteCount(data._count?.favorites || 0)

        // Check if user has favorited this recipe
        if (isAuthenticated && user) {
          const favoriteStatus = await apiClient.recipes.checkFavorite(params.id)
          setIsFavorite(favoriteStatus.isFavorite)
        }
      } catch (err) {
        setError("Failed to load recipe")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id, isAuthenticated, user])

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to save recipes to favorites")
      return
    }

    try {
      if (isFavorite) {
        await apiClient.recipes.removeFavorite(recipe.id)
        setIsFavorite(false)
        setFavoriteCount((prev) => prev - 1)
        toast.success("Recipe removed from your favorites")
      } else {
        await apiClient.recipes.addFavorite(recipe.id)
        setIsFavorite(true)
        setFavoriteCount((prev) => prev + 1)
        toast.success("Recipe added to your favorites")
      }
    } catch (e) {
      const error = e as Error
      toast.error(error.message || "Failed to update favorites")
    }
  }

  const handleDeleteRecipe = async () => {
    try {
      await apiClient.recipes.delete(recipe.id)
      toast.success("Your recipe has been successfully deleted")
      router.push("/recipes")
    } catch (e) {
        const error = e as Error
      toast.error(error.message || "Failed to delete recipe")
    }
  }

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading recipe...</p>
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
            <Link href="/recipes">Back to Recipes</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isAuthor = isAuthenticated && user && recipe.author.id === user.id

  return (
    <div className="container py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link href="/recipes" className="text-sm text-muted-foreground hover:text-primary">
                  Recipes
                </Link>
                <span className="text-muted-foreground">/</span>
                <Link
                  href={`/recipes?categoryId=${recipe.category.id}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {recipe.category.name}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Printer className="h-4 w-4" />
                  <span className="sr-only">Print recipe</span>
                </Button>
                <ShareRecipeModal
                  recipeId={recipe.id}
                  recipeTitle={recipe.title}
                  trigger={
                    <Button variant="outline" size="icon">
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
                        className="h-4 w-4"
                      >
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                      <span className="sr-only">Share recipe</span>
                    </Button>
                  }
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleFavorite}
                  className={isFavorite ? "text-primary" : ""}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary" : ""}`} />
                  <span className="sr-only">{isFavorite ? "Remove from favorites" : "Save recipe"}</span>
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
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>
                  {favoriteCount} {favoriteCount === 1 ? "favorite" : "favorites"}
                  {recipe.averageRating ? ` • ${recipe.averageRating.toFixed(1)}` : ""}
                  {recipe.ratingCount > 0 && ` (${recipe.ratingCount} ratings)`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">By</span>
              <Link href={`/profile/${recipe.author.id}`} className="text-sm font-medium hover:text-primary">
                {recipe.author.firstName} {recipe.author.lastName}
              </Link>

              {isAuthor && (
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/recipes/${recipe.id}/edit`}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>

                  <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your recipe and remove it from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteRecipe}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
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

          <CommentSection recipeId={recipe.id} />
        </div>

        <div className="space-y-8">
          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold">Similar Recipes</h3>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt="Recipe thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {["Creamy Mushroom Pasta", "Garlic Butter Shrimp Pasta", "Lemon Ricotta Pasta"][i]}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{[25, 20, 15][i]} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">
              View More
            </Button>
          </div>

          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold">Recipe Collections</h3>
            <div className="space-y-2">
              {["Quick Weeknight Dinners", "Italian Favorites", "Vegetarian Pasta Dishes", "Date Night Recipes"].map(
                (collection, i) => (
                  <Link
                    key={i}
                    href={`/collections/${collection.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block p-2 hover:bg-muted rounded-md transition-colors"
                  >
                    {collection}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-4">
              <h3 className="font-bold">Cooking Tips</h3>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Al Dente Pasta:</span> Cook pasta until it`s tender but still firm when
                bitten.
              </p>
              <p className="text-sm">
                <span className="font-medium">Sauce Consistency:</span> If the sauce is too thick, add pasta water a
                tablespoon at a time.
              </p>
              <p className="text-sm">
                <span className="font-medium">Cheese Quality:</span> Use freshly grated Parmesan for the best flavor and
                melting properties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

