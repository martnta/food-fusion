"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { Clock, ImagePlus, Loader2, Save, Trash2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"

interface Category {
  id: string
  name: string
}

export default function CreateRecipePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    cookingTime: "",
    servings: "",
    difficulty: "",
    categoryId: "",
    imageUrl: "",
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)

  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to create recipes")
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiClient.categories.getAll()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast.error("Failed to load categories")
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Basic validation
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB")
        return
      }

      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData((prev) => ({ ...prev, imageUrl: "" }))
  }

  const uploadImage = async () => {
    if (!imageFile) return null

    setIsUploading(true)

    try {
      // In a real app, you would upload to a storage service
      // For this example, we'll use a placeholder URL
      const imageUrl = `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(formData.title)}`

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setFormData((prev) => ({ ...prev, imageUrl }))
      return imageUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image")
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const validateForm = () => {
    if (!formData.title) {
      toast.error("Please enter a recipe title")
      return false
    }

    if (!formData.description) {
      toast.error("Please enter a recipe description")
      return false
    }

    if (!formData.ingredients) {
      toast.error("Please enter recipe ingredients")
      return false
    }

    if (!formData.instructions) {
      toast.error("Please enter recipe instructions")
      return false
    }

    if (!formData.cookingTime) {
      toast.error("Please enter cooking time")
      return false
    }

    if (!formData.servings) {
      toast.error("Please enter number of servings")
      return false
    }

    if (!formData.difficulty) {
      toast.error("Please select difficulty level")
      return false
    }

    if (!formData.categoryId) {
      toast.error("Please select a category")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Upload image if present
      let imageUrl = formData.imageUrl
      if (imageFile && !imageUrl) {
        imageUrl = (await uploadImage()) || ""
      }

      // Create recipe
      const response = await apiClient.recipes.create({
        ...formData,
        imageUrl,
        cookingTime: Number.parseInt(formData.cookingTime),
        servings: Number.parseInt(formData.servings),
      })

      if (response.error) {
        toast.error(response.error)
        return
      }

      toast.success("Recipe created successfully!")

      // Redirect to the new recipe
      router.push(`/recipes/${response.recipe.id}`)
    } catch (error) {
      console.error("Error creating recipe:", error)
      toast.error("Failed to create recipe")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const goToNextTab = () => {
    if (activeTab === "details") setActiveTab("ingredients")
    else if (activeTab === "ingredients") setActiveTab("instructions")
    else if (activeTab === "instructions") setActiveTab("image")
  }

  const goToPreviousTab = () => {
    if (activeTab === "image") setActiveTab("instructions")
    else if (activeTab === "instructions") setActiveTab("ingredients")
    else if (activeTab === "ingredients") setActiveTab("details")
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty")
      return
    }

    setIsCreatingCategory(true)
    try {
      const response = await apiClient.categories.create({ 
        name: newCategoryName.trim() 
      })
      
      if (response.category) {
        // Add the new category to the list and select it
        setCategories(prev => [...prev, response.category])
        setFormData(prev => ({ ...prev, categoryId: response.category.id }))
        setNewCategoryName("")
        toast.success("Category created successfully")
      }
    } catch (error) {
      console.error("Error creating category:", error)
      toast.error("Failed to create category")
    } finally {
      setIsCreatingCategory(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Recipe</h1>
          <p className="mt-2 text-muted-foreground">Share your culinary creations with the FoodFusion community</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="create-category">Create Category</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Recipe Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter recipe title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Briefly describe your recipe"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cookingTime">Cooking Time (minutes)</Label>
                    <Input
                      id="cookingTime"
                      name="cookingTime"
                      type="number"
                      min="1"
                      placeholder="e.g. 30"
                      value={formData.cookingTime}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="servings">Servings</Label>
                    <Input
                      id="servings"
                      name="servings"
                      type="number"
                      min="1"
                      placeholder="e.g. 4"
                      value={formData.servings}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => handleSelectChange("difficulty", value)}
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) => handleSelectChange("categoryId", value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("create-category")}
                      >
                        Create New Category
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={goToNextTab}>
                  Next: Ingredients
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="create-category" className="space-y-6 mt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-category-name">New Category Name</Label>
                  <Input
                    id="new-category-name"
                    name="new-category-name"
                    placeholder="Enter new category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                  Back: Details
                </Button>
                <Button type="button" onClick={handleCreateCategory} disabled={isCreatingCategory}>
                  {isCreatingCategory ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Category"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ingredients" className="space-y-6 mt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ingredients">
                    Ingredients
                    <span className="ml-1 text-sm text-muted-foreground">(one per line)</span>
                  </Label>
                  <Textarea
                    id="ingredients"
                    name="ingredients"
                    placeholder="e.g. 2 cups flour
1/2 cup sugar
2 eggs"
                    rows={10}
                    value={formData.ingredients}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPreviousTab}>
                  Back: Details
                </Button>
                <Button type="button" onClick={goToNextTab}>
                  Next: Instructions
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="instructions" className="space-y-6 mt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="instructions">
                    Instructions
                    <span className="ml-1 text-sm text-muted-foreground">(number each step or separate by line)</span>
                  </Label>
                  <Textarea
                    id="instructions"
                    name="instructions"
                    placeholder="e.g. 1. Preheat oven to 350°F.
2. Mix dry ingredients in a bowl.
3. Add wet ingredients and stir until combined."
                    rows={10}
                    value={formData.instructions}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPreviousTab}>
                  Back: Ingredients
                </Button>
                <Button type="button" onClick={goToNextTab}>
                  Next: Add Image
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-6 mt-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label>Recipe Image</Label>
                  <div className="border rounded-lg p-4">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <div className="aspect-video relative rounded-md overflow-hidden">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Recipe preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeImage}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="rounded-full bg-muted p-4 mb-4">
                          <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">Drag and drop an image, or click to browse</p>
                        <Label
                          htmlFor="image-upload"
                          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                          Upload Image
                        </Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {formData.title && formData.description && (
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-video relative">
                        <Image
                          src={imagePreview || "/placeholder.svg?height=400&width=800"}
                          alt="Recipe preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold">{formData.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{formData.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          {formData.cookingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{formData.cookingTime} min</span>
                            </div>
                          )}
                          {formData.servings && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{formData.servings} servings</span>
                            </div>
                          )}
                          {formData.difficulty && (
                            <div className="flex items-center gap-1">
                              <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                                {formData.difficulty}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPreviousTab}>
                  Back: Instructions
                </Button>
                <Button type="submit" disabled={isLoading || isUploading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Recipe
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  )
}
