"use client"

import { useState, useEffect } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignUpModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setOpen(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join FoodFusion Today!</DialogTitle>
          <DialogDescription>
            Sign up to access exclusive recipes, save your favorites, and join our culinary community.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="first-name" className="text-right">
              First name
            </Label>
            <Input id="first-name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="last-name" className="text-right">
              Last name
            </Label>
            <Input id="last-name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" type="email" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input id="password" type="password" className="col-span-3" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button type="submit">Sign Up</Button>
          <Button variant="outline" asChild>
            <DialogClose>Maybe Later</DialogClose>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

