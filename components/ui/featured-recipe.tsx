import Link from "next/link"
import Image from "next/image"
import { Clock, Star } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FeaturedRecipeCardProps {
  title: string
  image: string
  difficulty: string
  time: string
  rating: number
}

export function FeaturedRecipeCard({ title, image, difficulty, time, rating }: FeaturedRecipeCardProps) {
  return (
    <Link href="/recipes/1">
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          <Badge className="absolute top-2 right-2">{difficulty}</Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{time}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-primary text-primary mr-1" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">View Recipe</span>
        </CardFooter>
      </Card>
    </Link>
  )
}

