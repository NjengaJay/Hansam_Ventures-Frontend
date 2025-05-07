import PropertyGrid from "@/components/property/property-grid"
import FilterBar from "@/components/filter/filter-bar"
import { getProperties } from "@/lib/api"

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined
  const minPrice = typeof searchParams.min_price === "string" ? searchParams.min_price : undefined
  const maxPrice = typeof searchParams.max_price === "string" ? searchParams.max_price : undefined
  const city = typeof searchParams.city === "string" ? searchParams.city : undefined
  const state = typeof searchParams.state === "string" ? searchParams.state : undefined
  const country = typeof searchParams.country === "string" ? searchParams.country : undefined
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined
  const ordering = typeof searchParams.ordering === "string" ? searchParams.ordering : undefined

  const filters = {
    page,
    category,
    min_price: minPrice,
    max_price: maxPrice,
    city,
    state,
    country,
    search,
    ordering,
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
