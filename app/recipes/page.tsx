"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Plus, Search, Star } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"

interface Recipe {
  id: string
  title: string
  description: string
  cookingTime: number
  servings: number
  difficulty: string
  imageUrl: string | null
  author: {
    id: string
    firstName: string
    lastName: string
  }
  category: {
    id: string
    name: string
  }
  _count: {
    favorites: number
    comments: number
  }
}

interface Category {
  id: string
  name: string
  description: string | null
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    categories: [] as string[],
    difficulties: [] as string[],
    cookingTimes: [] as string[],
  })
  const [sortBy, setSortBy] = useState("newest")
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    pages: 1,
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()

  // Initialize from URL params
  useEffect(() => {
    const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page") as string) : 1
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("categoryId") || ""
    const sort = searchParams.get("sort") || "newest"

    setPagination((prev) => ({ ...prev, page }))
    setSearchTerm(search)
    setSortBy(sort)

    if (categoryId) {
      setFilters((prev) => ({
        ...prev,
        categories: [categoryId],
      }))
    }

    // Fetch categories
    fetchCategories()

    // Fetch recipes with these params
    fetchRecipes(page, search, categoryId, sort)
  }, [searchParams])

  const fetchCategories = async () => {
    try {
      const data = await apiClient.categories.getAll()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchRecipes = async (
    page = pagination.page,
    search = searchTerm,
    categoryId = filters.categories[0] || "",
    sort = sortBy,
  ) => {
    setLoading(true)

    try {
      // Build query params
      const params: Record<string, string> = {
        page: page.toString(),
        limit: pagination.limit.toString(),
      }

      if (search) params.search = search
      if (categoryId) params.categoryId = categoryId

      // Handle sorting
      switch (sort) {
        case "popular":
          params.sortBy = "favorites"
          params.sortDir = "desc"
          break
        case "rating":
          params.sortBy = "rating"
          params.sortDir = "desc"
          break
        case "time-asc":
          params.sortBy = "cookingTime"
          params.sortDir = "asc"
          break
        case "time-desc":
          params.sortBy = "cookingTime"
          params.sortDir = "desc"
          break
        default:
          params.sortBy = "createdAt"
          params.sortDir = "desc"
      }

      const data = await apiClient.recipes.getAll(params)
      setRecipes(data.recipes)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching recipes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Update URL with search params
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (filters.categories.length > 0) params.set("categoryId", filters.categories[0])
    if (sortBy !== "newest") params.set("sort", sortBy)
    params.set("page", "1") // Reset to first page on new search

    router.push(`/recipes?${params.toString()}`)
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      categories: checked ? [...prev.categories, categoryId] : prev.categories.filter((id) => id !== categoryId),
    }))
  }

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      difficulties: checked ? [...prev.difficulties, difficulty] : prev.difficulties.filter((d) => d !== difficulty),
    }))
  }

  const handleCookingTimeChange = (timeRange: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      cookingTimes: checked ? [...prev.cookingTimes, timeRange] : prev.cookingTimes.filter((t) => t !== timeRange),
    }))
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const handleApplyFilters = () => {
    // Update URL with filter params
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (filters.categories.length > 0) params.set("categoryId", filters.categories[0])
    if (sortBy !== "newest") params.set("sort", sortBy)
    params.set("page", "1") // Reset to first page on filter change

    router.push(`/recipes?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return

    // Update URL with page param
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())

    router.push(`/recipes?${params.toString()}`)
  }

  return (
    <div className="container py-12">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Recipe Collection</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
          Explore our curated collection of diverse recipes from around the world
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-64 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Filter Recipes</h3>
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Cuisine Type</h4>
              <div className="space-y-1">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                    />
                    <Label htmlFor={`category-${category.id}`} className="text-sm">
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Difficulty</h4>
            <div className="space-y-1">
              {["Easy", "Medium", "Hard"].map((difficulty) => (
                <div key={difficulty} className="flex items-center space-x-2">
                  <Checkbox
                    id={`difficulty-${difficulty.toLowerCase()}`}
                    checked={filters.difficulties.includes(difficulty)}
                    onCheckedChange={(checked) => handleDifficultyChange(difficulty, checked as boolean)}
                  />
                  <Label htmlFor={`difficulty-${difficulty.toLowerCase()}`} className="text-sm">
                    {difficulty}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Cooking Time</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="under-30"
                  checked={filters.cookingTimes.includes("under-30")}
                  onCheckedChange={(checked) => handleCookingTimeChange("under-30", checked as boolean)}
                />
                <Label htmlFor="under-30" className="text-sm">
                  Under 30 minutes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="30-60"
                  checked={filters.cookingTimes.includes("30-60")}
                  onCheckedChange={(checked) => handleCookingTimeChange("30-60", checked as boolean)}
                />
                <Label htmlFor="30-60" className="text-sm">
                  30-60 minutes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="over-60"
                  checked={filters.cookingTimes.includes("over-60")}
                  onCheckedChange={(checked) => handleCookingTimeChange("over-60", checked as boolean)}
                />
                <Label htmlFor="over-60" className="text-sm">
                  Over 60 minutes
                </Label>
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <form onSubmit={handleSearch} className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search recipes..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="time-asc">Cooking Time (Low to High)</SelectItem>
                  <SelectItem value="time-desc">Cooking Time (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isAuthenticated && (
            <div className="mb-6">
              <Button asChild>
                <Link href="/recipes/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Recipe
                </Link>
              </Button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No recipes found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  router.push("/recipes")
                  setSearchTerm("")
                  setFilters({
                    categories: [],
                    difficulties: [],
                    cookingTimes: [],
                  })
                  setSortBy("newest")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
                  <Card className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={recipe.imageUrl || "/placeholder.svg?height=300&width=400"}
                        alt={recipe.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                      <Badge className="absolute top-2 right-2">{recipe.difficulty}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold">{recipe.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{recipe.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{recipe.cookingTime} min</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        By {recipe.author.firstName} {recipe.author.lastName}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                        <span className="text-sm font-medium">{recipe._count.favorites}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">View Recipe</span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
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
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  <span className="sr-only">Previous</span>
                </Button>

                {Array.from({ length: Math.min(5, pagination.pages) }).map((_, i) => {
                  // Show pages around current page
                  let pageNum = pagination.page - 2 + i
                  if (pagination.page < 3) {
                    pageNum = i + 1
                  } else if (pagination.page > pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i
                  }

                  // Ensure page number is valid
                  if (pageNum < 1 || pageNum > pagination.pages) return null

                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
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
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                  <span className="sr-only">Next</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

