"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProperty, updateProperty } from "@/lib/api"
import { X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"

interface PropertyFormProps {
  property?: any
  categories: any[]
  onSubmit: (property: any) => void
  onCancel: () => void
}

export default function PropertyForm({ property, categories, onSubmit, onCancel }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    city: "",
    state: "",
    country: "",
  })

  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<any[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        price: property.price?.toString() || "",
        category: property.category?.id?.toString() || "",
        city: property.city || "",
        state: property.state || "",
        country: property.country || "",
      })

      if (property.images && property.images.length > 0) {
        setExistingImages(property.images)

        // Find primary image index
        const primaryIndex = property.images.findIndex((img: any) => img.id === property.primary_image?.id)
        if (primaryIndex !== -1) {
          setPrimaryImageIndex(primaryIndex)
        }
      }
    }
  }, [property])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)

      // Check if total images would exceed 5
      if (existingImages.length + images.length + selectedFiles.length > 5) {
        setErrors((prev) => ({
          ...prev,
          images: "Maximum 5 images allowed per property",
        }))
        return
      }

      setImages((prev) => [...prev, ...selectedFiles])

      // Create previews for new images
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
      setImagePreviews((prev) => [...prev, ...newPreviews])

      // Clear error if it exists
      if (errors.images) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.images
          return newErrors
        })
      }
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))

    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index])
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))

    // Adjust primary image index if needed
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0)
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1)
    }
  }

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))

    // Adjust primary image index if needed
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0)
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1)
    }
  }

  const setPrimaryImage = (index: number, isExisting = false) => {
    if (isExisting) {
      // If selecting from existing images, adjust index to account for new images
      setPrimaryImageIndex(index)
    } else {
      // If selecting from new images, adjust index to account for existing images
      setPrimaryImageIndex(existingImages.length + index)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required"
    }

    if (!property && images.length === 0 && existingImages.length === 0) {
      newErrors.images = "At least one image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()

      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })

      // Add images
      images.forEach((image) => {
        formDataToSend.append("images", image)
      })

      // Add existing images to keep
      existingImages.forEach((image) => {
        formDataToSend.append("existing_images", image.id.toString())
      })

      // Set primary image
      if (primaryImageIndex < existingImages.length) {
        // Primary image is an existing image
        formDataToSend.append("primary_image", existingImages[primaryImageIndex].id.toString())
      } else {
        // Primary image is a new image (mark by index)
        formDataToSend.append("primary_image_index", (primaryImageIndex - existingImages.length).toString())
      }

      let result
      if (property) {
        result = await updateProperty(property.id, formDataToSend)
      } else {
        result = await createProperty(formDataToSend)
      }

      onSubmit(result)
    } catch (error) {
      console.error("Error submitting property:", error)
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to save property. Please try again.",
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">
            Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={errors.city ? "border-red-500" : ""}
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input id="state" name="state" value={formData.state} onChange={handleInputChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">
            Country <span className="text-red-500">*</span>
          </Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={errors.country ? "border-red-500" : ""}
          />
          {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={6}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label>
          Property Images <span className="text-red-500">*</span>
          <span className="text-gray-500 text-sm ml-2">(Max 5 images)</span>
        </Label>

        {(existingImages.length > 0 || images.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
            {existingImages.map((image, index) => (
              <div
                key={`existing-${image.id}`}
                className={`relative rounded-md overflow-hidden border-2 ${
                  primaryImageIndex === index ? "border-rose-600" : "border-gray-200"
                }`}
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.thumbnail || "/placeholder.svg"}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setPrimaryImage(index, true)}
                  className={`absolute bottom-0 left-0 right-0 text-xs py-1 text-center ${
                    primaryImageIndex === index
                      ? "bg-rose-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {primaryImageIndex === index ? "Primary" : "Set as Primary"}
                </button>
              </div>
            ))}

            {imagePreviews.map((preview, index) => (
              <div
                key={`preview-${index}`}
                className={`relative rounded-md overflow-hidden border-2 ${
                  primaryImageIndex === existingImages.length + index ? "border-rose-600" : "border-gray-200"
                }`}
              >
                <div className="aspect-square relative">
                  <Image
                    src={preview || "/placeholder.svg"}
                    alt={`New image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setPrimaryImage(index)}
                  className={`absolute bottom-0 left-0 right-0 text-xs py-1 text-center ${
                    primaryImageIndex === existingImages.length + index
                      ? "bg-rose-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {primaryImageIndex === existingImages.length + index ? "Primary" : "Set as Primary"}
                </button>
              </div>
            ))}

            {existingImages.length + images.length < 5 && (
              <label className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center p-4 cursor-pointer hover:border-gray-400 aspect-square">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add Image</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        )}

        {existingImages.length === 0 && images.length === 0 && (
          <label className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center p-8 cursor-pointer hover:border-gray-400">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <span className="text-sm text-gray-500 mb-2">Click to upload images</span>
            <span className="text-xs text-gray-400">(Max 5 images, first image will be primary)</span>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
          </label>
        )}

        {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{errors.submit}</div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {property ? "Update Property" : "Add Property"}
        </Button>
      </div>
    </form>
  )
}
