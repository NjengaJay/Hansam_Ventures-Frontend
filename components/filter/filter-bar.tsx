"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { getCategories } from "@/lib/api"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    city: searchParams.get("city") || "",
    state: searchParams.get("state") || "",
    country: searchParams.get("country") || "",
    ordering: searchParams.get("ordering") || "",
  })

  const [priceRange, setPriceRange] = useState([
    filters.min_price ? Number.parseInt(filters.min_price) : 0,
    filters.max_price ? Number.parseInt(filters.max_price) : 1000000,
  ])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data.results || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories([])
      }
    }

    fetchCategories()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values)
    setFilters((prev) => ({
      ...prev,
      min_price: values[0].toString(),
      max_price: values[1].toString(),
    }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    router.push(`/?${params.toString()}`)
    setIsOpen(false)
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      min_price: "",
      max_price: "",
      city: "",
      state: "",
      country: "",
      ordering: "",
    })
    setPriceRange([0, 1000000])
    router.push("/")
    setIsOpen(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            name="search"
            placeholder="Search properties..."
            className="pl-10"
            value={filters.search}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>

        <div className="flex gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Properties</SheetTitle>
                <SheetDescription>Refine your property search with these filters</SheetDescription>
              </SheetHeader>

              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={filters.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="pt-6 px-2">
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={1000000}
                      step={10000}
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>${priceRange[0].toLocaleString()}</span>
                    <span>${priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={filters.city}
                    onChange={handleInputChange}
                    placeholder="Any City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    value={filters.state}
                    onChange={handleInputChange}
                    placeholder="Any State"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={filters.country}
                    onChange={handleInputChange}
                    placeholder="Any Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ordering">Sort By</Label>
                  <Select value={filters.ordering} onValueChange={(value) => handleSelectChange("ordering", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="price">Price (Low to High)</SelectItem>
                      <SelectItem value="-price">Price (High to Low)</SelectItem>
                      <SelectItem value="-created_at">Newest First</SelectItem>
                      <SelectItem value="created_at">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={applyFilters} className="flex-1">
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={resetFilters} className="flex-1">
                    <X className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button onClick={applyFilters}>Search</Button>
        </div>
      </div>
    </div>
  )
}
