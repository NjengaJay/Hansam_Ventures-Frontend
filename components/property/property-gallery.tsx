"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyGalleryProps {
  images: {
    id: number
    image: string
    thumbnail: string
  }[]
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) {
    return (
      <div className="relative h-[400px] w-full bg-gray-200 rounded-lg mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
        <Image
          src={images[currentIndex]?.image || "/placeholder.svg?height=400&width=800"}
          alt={`Property image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
        />

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-10 w-10"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous image</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-10 w-10"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next image</span>
            </Button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                currentIndex === index ? "border-rose-600" : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={image.thumbnail || "/placeholder.svg?height=80&width=80"}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
