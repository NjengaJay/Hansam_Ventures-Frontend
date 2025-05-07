import PropertyGrid from "@/components/property/property-grid"
import FilterBar from "@/components/filter/filter-bar"
import { getProperties } from "@/lib/api"

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const params = await searchParams
  
  const filters = {
    page: typeof params.page === "string" ? Number.parseInt(params.page) : 1,
    category: typeof params.category === "string" ? params.category : undefined,
    min_price: typeof params.min_price === "string" ? params.min_price : undefined,
    max_price: typeof params.max_price === "string" ? params.max_price : undefined,
    city: typeof params.city === "string" ? params.city : undefined,
    state: typeof params.state === "string" ? params.state : undefined,
    country: typeof params.country === "string" ? params.country : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
    ordering: typeof params.ordering === "string" ? params.ordering : undefined,
  }

  const properties = await getProperties(filters)

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Your Dream Property</h1>
        <p className="text-lg text-gray-600">Explore our exclusive collection of premium properties</p>
      </section>

      <FilterBar />

      <section className="mt-8">
        <PropertyGrid properties={properties} />
      </section>
    </div>
  )
}
