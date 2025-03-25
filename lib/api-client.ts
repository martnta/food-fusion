/* eslint-disable @typescript-eslint/no-explicit-any */
// A simple API client for making authenticated requests

// Base API URL
const API_BASE_URL = "/api"

// Helper function to get auth token from localStorage
const getToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

// Generic fetch function with authentication
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // Handle 401 Unauthorized globally
  if (response.status === 401) {
    // Clear auth data if stored
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")

    // Redirect to login page if in browser context
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }

  return response
}

// API client with methods for common operations
export const apiClient = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      return await response.json()
    },

    register: async (userData: {
      firstName: string
      lastName: string
      email: string
      password: string
    }) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
      return await response.json()
    },

    me: async () => {
      const response = await fetchWithAuth("/auth/me")
      return await response.json()
    },
  },

  // Recipe endpoints
  recipes: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params as Record<string, string>).toString()
      const response = await fetch(`${API_BASE_URL}/recipes?${queryString}`)
      return await response.json()
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`)
      return await response.json()
    },

    create: async (recipeData: any) => {
      const response = await fetchWithAuth("/recipes", {
        method: "POST",
        body: JSON.stringify(recipeData),
      })
      return await response.json()
    },

    update: async (id: string, recipeData: any) => {
      const response = await fetchWithAuth(`/recipes/${id}`, {
        method: "PUT",
        body: JSON.stringify(recipeData),
      })
      return await response.json()
    },

    delete: async (id: string) => {
      const response = await fetchWithAuth(`/recipes/${id}`, {
        method: "DELETE",
      })
      return await response.json()
    },

    share: async (recipeId: string, shareData: any) => {
      const response = await fetchWithAuth("/recipes/share", {
        method: "POST",
        body: JSON.stringify({
          recipeId,
          ...shareData,
        }),
      })
      return await response.json()
    },

    getShared: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/recipes/shared/${token}`)
      return await response.json()
    },

    addFavorite: async (recipeId: string) => {
      const response = await fetchWithAuth(`/recipes/${recipeId}/favorite`, {
        method: "POST",
      })
      return await response.json()
    },

    removeFavorite: async (recipeId: string) => {
      const response = await fetchWithAuth(`/recipes/${recipeId}/favorite`, {
        method: "DELETE",
      })
      return await response.json()
    },

    checkFavorite: async (recipeId: string) => {
      const response = await fetchWithAuth(`/recipes/${recipeId}/favorite`)
      return await response.json()
    },
  },

  // Categories endpoints
  categories: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/categories`)
      return await response.json()
    },

    create: async (categoryData: any) => {
      const response = await fetchWithAuth("/categories", {
        method: "POST",
        body: JSON.stringify(categoryData),
      })
      return await response.json()
    },
  },

  // Comments endpoints
  comments: {
    getForRecipe: async (recipeId: string) => {
      const response = await fetch(`${API_BASE_URL}/comments?recipeId=${recipeId}`)
      return await response.json()
    },

    create: async (commentData: any) => {
      const response = await fetchWithAuth("/comments", {
        method: "POST",
        body: JSON.stringify(commentData),
      })
      return await response.json()
    },

    update: async (id: string, content: string) => {
      const response = await fetchWithAuth(`/comments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ content }),
      })
      return await response.json()
    },

    delete: async (id: string) => {
      const response = await fetchWithAuth(`/comments/${id}`, {
        method: "DELETE",
      })
      return await response.json()
    },
  },
}

