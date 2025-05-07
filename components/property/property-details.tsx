import { formatCurrency } from "@/lib/utils"
import { Tag, MapPin, Calendar } from "lucide-react"

interface PropertyDetailsProps {
  property: {
    title: string
    description: string
    price: number
    category: {
      name: string
    }
    city: string
    state: string
    country: string
    created_at: string
  }
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const formattedDate = new Date(property.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{property.title}</h1>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center text-gray-600">
            <Tag className="h-5 w-5 mr-1 text-rose-600" />
            <span>{property.category.name}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-1 text-rose-600" />
            <span>{[property.city, property.state, property.country].filter(Boolean).join(", ")}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-1 text-rose-600" />
            <span>Listed on {formattedDate}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl font-bold text-rose-600">{formatCurrency(property.price)}</div>
        </div>
      </div>

      <div className="prose max-w-none">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
        <div className="text-gray-600 whitespace-pre-line">{property.description}</div>
      </div>
    </div>
  )
}
