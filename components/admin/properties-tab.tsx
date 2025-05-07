"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import PropertyForm from "./property-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteProperty } from "@/lib/api"

interface PropertiesTabProps {
  properties: any[]
  categories: any[]
  onUpdate: (properties: any[]) => void
}

export default function PropertiesTab({ properties, categories, onUpdate }: PropertiesTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleAddProperty = (newProperty: any) => {
    onUpdate([newProperty, ...properties])
    setIsAddDialogOpen(false)
  }

  const handleEditProperty = (updatedProperty: any) => {
    const updatedProperties = properties.map((property) =>
      property.id === updatedProperty.id ? updatedProperty : property,
    )
    onUpdate(updatedProperties)
    setIsEditDialogOpen(false)
    setSelectedProperty(null)
  }

  const handleDeleteProperty = async (propertyId: number) => {
    setIsDeleting(true)
    try {
      await deleteProperty(propertyId)
      const updatedProperties = properties.filter((property) => property.id !== propertyId)
      onUpdate(updatedProperties)
    } catch (error) {
      console.error("Error deleting property:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Properties</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>Fill in the details to add a new property listing.</DialogDescription>
            </DialogHeader>
            <PropertyForm
              categories={categories}
              onSubmit={handleAddProperty}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600">No properties found</h3>
          <p className="text-gray-500 mt-2 mb-6">Get started by adding your first property.</p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded overflow-hidden">
                      <Image
                        src={property.primary_image?.thumbnail || "/placeholder.svg?height=48&width=48"}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>{property.category.name}</TableCell>
                  <TableCell>{[property.city, property.state, property.country].filter(Boolean).join(", ")}</TableCell>
                  <TableCell>{formatCurrency(property.price)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/property/${property.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>

                      <Dialog
                        open={isEditDialogOpen && selectedProperty?.id === property.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open)
                          if (!open) setSelectedProperty(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProperty(property)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Property</DialogTitle>
                            <DialogDescription>Update the details of this property listing.</DialogDescription>
                          </DialogHeader>
                          {selectedProperty && (
                            <PropertyForm
                              property={selectedProperty}
                              categories={categories}
                              onSubmit={handleEditProperty}
                              onCancel={() => {
                                setIsEditDialogOpen(false)
                                setSelectedProperty(null)
                              }}
                            />
                          )}
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the property and remove it from
                              our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProperty(property.id)}
                              disabled={isDeleting}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
