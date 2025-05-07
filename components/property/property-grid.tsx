import { getContactInfo } from "@/lib/api"
import PropertyCard from "./property-card"
import Pagination from "@/components/ui/pagination"

interface PropertyGridProps {
  properties: {
    count: number
    next: string | null
    previous: string | null
    results: any[]
  }
}

export default async function PropertyGrid({ properties }: PropertyGridProps) {
  const contactInfo = await getContactInfo()
  const propertyList = properties.results || properties

  if (!propertyList || propertyList.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600">No properties found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {propertyList.map((property) => (
          <PropertyCard key={property.id} property={property} contactInfo={contactInfo} />
        ))}
      </div>

      {properties.count > 0 && (
        <Pagination
          totalItems={properties.count}
          itemsPerPage={propertyList.length}
          hasNext={!!properties.next}
          hasPrevious={!!properties.previous}
        />
      )}
    </div>
  )
}
