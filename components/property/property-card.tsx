import Image from "next/image"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { MapPin, Tag } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PropertyCardProps {
  property: {
    id: number
    slug: string
    title: string
    price: number
    category: {
      name: string
    }
    city: string
    state: string
    country: string
    primary_image: {
      thumbnail: string
    }
  }
  contactInfo: {
    whatsapp_number: string
  }
}

export default function PropertyCard({ property, contactInfo }: PropertyCardProps) {
  const whatsappLink = `https://wa.me/${contactInfo.whatsapp_number}?text=I%20am%20interested%20in%20${encodeURIComponent(property.title)}`

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Link href={`/property/${property.slug}`}>
          <Image
            src={property.primary_image?.thumbnail || "/placeholder.svg?height=192&width=384"}
            alt={property.title}
            fill
            className="object-cover"
          />
        </Link>
      </div>

      <CardContent className="pt-6 flex-grow">
        <Link href={`/property/${property.slug}`} className="hover:underline">
          <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">{property.title}</h3>
        </Link>

        <div className="flex items-center text-gray-500 mb-2">
          <Tag className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.category.name}</span>
        </div>

        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm line-clamp-1">
            {[property.city, property.state, property.country].filter(Boolean).join(", ")}
          </span>
        </div>

        <div className="mt-2 text-xl font-bold text-rose-600">{formatCurrency(property.price)}</div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            Inquire via WhatsApp
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
