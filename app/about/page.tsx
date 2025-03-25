import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">About FoodFusion</h1>
          <p className="text-muted-foreground md:text-xl/relaxed">
            Our mission is to promote home cooking and culinary creativity among food enthusiasts.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p className="text-muted-foreground">
              FoodFusion was founded in 2023 by a group of passionate home cooks who wanted to create a platform where
              food enthusiasts could share recipes, learn new techniques, and connect with like-minded individuals.
            </p>
            <p className="text-muted-foreground">
              What started as a small community has grown into a vibrant platform with thousands of users sharing their
              culinary creations and experiences.
            </p>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="FoodFusion team cooking together"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2 p-4 border rounded-lg">
              <h3 className="text-xl font-bold">Inclusivity</h3>
              <p className="text-muted-foreground">
                We believe that cooking is for everyone, regardless of skill level or background. Our platform is
                designed to be accessible and welcoming to all.
              </p>
            </div>
            <div className="space-y-2 p-4 border rounded-lg">
              <h3 className="text-xl font-bold">Creativity</h3>
              <p className="text-muted-foreground">
                We encourage experimentation and innovation in the kitchen, inspiring our users to put their own spin on
                traditional recipes.
              </p>
            </div>
            <div className="space-y-2 p-4 border rounded-lg">
              <h3 className="text-xl font-bold">Community</h3>
              <p className="text-muted-foreground">
                We foster a supportive environment where users can share their successes, learn from their mistakes, and
                connect with fellow food enthusiasts.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Meet Our Team</h2>
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 relative mb-4">
                <Image
                  src="/placeholder.svg?height=96&width=96"
                  alt="Team member"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="font-bold">Jane Doe</h3>
              <p className="text-sm text-muted-foreground">Founder & CEO</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-24 h-24 relative mb-4">
                <Image
                  src="/placeholder.svg?height=96&width=96"
                  alt="Team member"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="font-bold">John Smith</h3>
              <p className="text-sm text-muted-foreground">Head Chef</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-24 h-24 relative mb-4">
                <Image
                  src="/placeholder.svg?height=96&width=96"
                  alt="Team member"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="font-bold">Emily Chen</h3>
              <p className="text-sm text-muted-foreground">Content Director</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-24 h-24 relative mb-4">
                <Image
                  src="/placeholder.svg?height=96&width=96"
                  alt="Team member"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="font-bold">Michael Johnson</h3>
              <p className="text-sm text-muted-foreground">Community Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

