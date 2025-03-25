"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash2, Edit, Send } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

interface Comment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  userId: string
  recipeId: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

interface CommentSectionProps {
  recipeId: string
}

export function CommentSection({ recipeId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()

  // Fetch comments for this recipe
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await apiClient.comments.getForRecipe(recipeId)
        setComments(data)
      } catch (error) {
        console.error("Error fetching comments:", error)
      }
    }

    fetchComments()
  }, [recipeId])

  // Add a new comment
  const handleAddComment = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please log in to add a comment")
      return
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment")
      return
    }

    setIsLoading(true)

    try {
      const data = await apiClient.comments.create({
        content: newComment,
        userId: user.id,
        recipeId,
      })

      setComments([data.comment, ...comments])
      setNewComment("")
      toast.success("Comment added successfully")
    } catch (e) {
      const error = e as Error
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Start editing a comment
  const handleEditStart = (comment: Comment) => {
    setEditingCommentId(comment.id)
    setEditContent(comment.content)
  }

  // Cancel editing
  const handleEditCancel = () => {
    setEditingCommentId(null)
    setEditContent("")
  }

  // Save edited comment
  const handleEditSave = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    setIsLoading(true)

    try {
      const data = await apiClient.comments.update(commentId, editContent)

      setComments(comments.map((c) => (c.id === commentId ? data.comment : c)))
      setEditingCommentId(null)
      setEditContent("")
      toast.success("Comment updated successfully")
    } catch (e) {
      const error = e as Error
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a comment
  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return
    }

    setIsLoading(true)

    try {
      await apiClient.comments.delete(commentId)

      setComments(comments.filter((c) => c.id !== commentId))
      toast.success("Comment deleted successfully")
    } catch (e) {
      const error = e as Error
      toast.error(error.message || "Failed to delete comment")
    } finally {
      setIsLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Comments</h3>

      {isAuthenticated ? (
        <div className="flex gap-4">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddComment} disabled={isLoading || !newComment.trim()} className="self-end">
            <Send className="h-4 w-4 mr-2" />
            Post
          </Button>
        </div>
      ) : (
        <div className="bg-muted p-4 rounded-md text-center">
          <p className="text-muted-foreground">Please log in to add a comment</p>
          <Button variant="outline" className="mt-2" asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt={`${comment.user.firstName} ${comment.user.lastName}`}
                  />
                  <AvatarFallback>
                    {comment.user.firstName[0]}
                    {comment.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {comment.user.firstName} {comment.user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                    </div>
                    {user && user.id === comment.userId && (
                      <div className="flex gap-2">
                        {editingCommentId !== comment.id ? (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => handleEditStart(comment)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(comment.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditSave(comment.id)}
                              disabled={isLoading}
                            >
                              Save
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleEditCancel} disabled={isLoading}>
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment.id ? (
                    <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="mt-2" />
                  ) : (
                    <p className="mt-2">{comment.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

