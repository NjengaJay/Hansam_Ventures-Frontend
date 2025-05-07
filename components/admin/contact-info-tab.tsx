"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateContactInfo } from "@/lib/api"
import { Loader2, Phone, Mail, MessageCircle } from "lucide-react"

interface ContactInfoTabProps {
  contactInfo: {
    id: number
    phone_number: string
    email: string
    whatsapp_number: string
  }
  onUpdate: (contactInfo: any) => void
}

export default function ContactInfoTab({ contactInfo, onUpdate }: ContactInfoTabProps) {
  const [formData, setFormData] = useState({
    phone_number: contactInfo?.phone_number || "",
    email: contactInfo?.email || "",
    whatsapp_number: contactInfo?.whatsapp_number || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Clear success message when form is edited
    if (successMessage) {
      setSuccessMessage("")
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.whatsapp_number.trim()) {
      newErrors.whatsapp_number = "WhatsApp number is required"
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
    setSuccessMessage("")

    try {
      const updatedContactInfo = await updateContactInfo(contactInfo.id, formData)
      onUpdate(updatedContactInfo)
      setSuccessMessage("Contact information updated successfully!")
    } catch (error) {
      console.error("Error updating contact info:", error)
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to update contact information. Please try again.",
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Update your contact information for property inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {successMessage}
              </div>
            )}

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{errors.submit}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone_number" className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Phone Number
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className={errors.phone_number ? "border-red-500" : ""}
              />
              {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="contact@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp_number" className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp Number
              </Label>
              <Input
                id="whatsapp_number"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleInputChange}
                placeholder="+1234567890"
                className={errors.whatsapp_number ? "border-red-500" : ""}
              />
              <p className="text-xs text-gray-500">
                Enter the number without spaces or special characters (e.g., +1234567890)
              </p>
              {errors.whatsapp_number && <p className="text-red-500 text-sm">{errors.whatsapp_number}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
