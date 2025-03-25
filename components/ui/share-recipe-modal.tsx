"use client"

import type React from "react"

import { useState } from "react"
import { Copy, Facebook, Link, Mail, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ShareRecipeModalProps {
  recipeId: string
  recipeTitle: string
  trigger?: React.ReactNode
}

export function ShareRecipeModal({ recipeId, recipeTitle, trigger }: ShareRecipeModalProps) {
  const [open, setOpen] = useState(false)
  const [shareableLink, setShareableLink] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("link")
  const { user, isAuthenticated } = useAuth()

  // Generate a shareable link
  const generateShareableLink = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please log in to share recipes")
      return
    }

    setIsLoading(true)

    try {
      const data = await apiClient.recipes.share(recipeId, {
        userId: user.id,
        shareMethod: "link",
      })

      setShareableLink(data.shareableLink)
    } catch (e) {
      const error = e as Error
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink)
    toast.success("Shareable link copied to clipboard")
  }

  // Share via email
  const shareViaEmail = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please log in to share recipes")
      return
    }

    if (!recipientEmail) {
      toast.error("Please enter a recipient email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      await apiClient.recipes.share(recipeId, {
        userId: user.id,
        shareMethod: "email",
        recipientEmail,
      })

      toast.success(`Recipe shared with ${recipientEmail}`)
      setRecipientEmail("")
      setOpen(false)
    } catch (e) {
      const error = e as Error
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Share to social media
  const shareToSocialMedia = (platform: string) => {
    if (!shareableLink) {
      generateShareableLink()
      toast("Please generate a shareable link first")
      return
    }

    let url = ""
    const text = `Check out this recipe for ${recipeTitle} on FoodFusion!`

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareableLink,
        )}&quote=${encodeURIComponent(text)}`
        break
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}&text=${encodeURIComponent(
          text,
        )}`
        break
      default:
        return
    }

    window.open(url, "_blank", "width=600,height=400")
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "link" && !shareableLink) {
      generateShareableLink()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="outline">Share Recipe</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Recipe</DialogTitle>
          <DialogDescription>Share &ldquo;{recipeTitle}&ldquo; with friends and family</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  value={shareableLink}
                  readOnly
                  className="w-full"
                  placeholder="Generate a shareable link..."
                />
              </div>
              <Button type="button" size="icon" onClick={copyToClipboard} disabled={!shareableLink}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy</span>
              </Button>
            </div>

            {!shareableLink && (
              <Button onClick={generateShareableLink} disabled={isLoading || !isAuthenticated} className="w-full">
                <Link className="h-4 w-4 mr-2" />
                Generate Shareable Link
              </Button>
            )}

            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground text-center">Please log in to share recipes</p>
            )}
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Recipient Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="friend@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>

              <Button
                onClick={shareViaEmail}
                disabled={isLoading || !isAuthenticated || !recipientEmail}
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>

              {!isAuthenticated && (
                <p className="text-sm text-muted-foreground text-center">Please log in to share recipes</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">Share this recipe on your favorite social media platform</p>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => shareToSocialMedia("facebook")}
                  disabled={!isAuthenticated}
                >
                  <Facebook className="h-6 w-6" />
                  <span className="sr-only">Share to Facebook</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => shareToSocialMedia("twitter")}
                  disabled={!isAuthenticated}
                >
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Share to Twitter</span>
                </Button>
              </div>

              {!isAuthenticated && (
                <p className="text-sm text-muted-foreground text-center">Please log in to share recipes</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

