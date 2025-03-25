import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EventCardProps {
  title: string
  image: string
  date: string
  time: string
  location: string
}

export function EventCard({ title, image, date, time, location }: EventCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {date}, {time}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{location}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full">
          Register
        </Button>
      </CardFooter>
    </Card>
  )
}

