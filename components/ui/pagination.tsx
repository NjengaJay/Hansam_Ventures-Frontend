"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  hasNext: boolean
  hasPrevious: boolean
}

export default function Pagination({ totalItems, itemsPerPage, hasNext, hasPrevious }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page") || "1")

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())
    return `?${params.toString()}`
  }

  const goToPage = (pageNumber: number) => {
    router.push(createPageURL(pageNumber))
  }

  // If there's only one page, don't show pagination
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button variant="outline" size="icon" onClick={() => goToPage(currentPage - 1)} disabled={!hasPrevious}>
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      <div className="flex items-center space-x-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNumber

          // Logic to show pages around the current page
          if (totalPages <= 5) {
            // If 5 or fewer pages, show all
            pageNumber = i + 1
          } else if (currentPage <= 3) {
            // If near the start, show first 5 pages
            pageNumber = i + 1
          } else if (currentPage >= totalPages - 2) {
            // If near the end, show last 5 pages
            pageNumber = totalPages - 4 + i
          } else {
            // Otherwise show 2 before and 2 after current page
            pageNumber = currentPage - 2 + i
          }

          return (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="icon"
              onClick={() => goToPage(pageNumber)}
            >
              {pageNumber}
            </Button>
          )
        })}
      </div>

      <Button variant="outline" size="icon" onClick={() => goToPage(currentPage + 1)} disabled={!hasNext}>
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}
