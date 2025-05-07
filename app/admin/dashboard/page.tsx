"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PropertiesTab from "@/components/admin/properties-tab"
import ContactInfoTab from "@/components/admin/contact-info-tab"
import CategoriesTab from "@/components/admin/categories-tab"
import { getProperties, getContactInfo, getCategories } from "@/lib/api"

export default function AdminDashboard() {
  const [properties, setProperties] = useState([])
  const [contactInfo, setContactInfo] = useState(null)
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login")
      return
    }

    const fetchData = async () => {
      try {
        const [propertiesData, contactInfoData, categoriesData] = await Promise.all([
          getProperties({}),
          getContactInfo(),
          getCategories(),
        ])

        setProperties(propertiesData.results || [])
        setContactInfo(contactInfoData)
        setCategories(categoriesData.results || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="contact">Contact Information</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <PropertiesTab
            properties={properties}
            categories={categories}
            onUpdate={(updatedProperties) => setProperties(updatedProperties)}
          />
        </TabsContent>

        <TabsContent value="contact">
          <ContactInfoTab
            contactInfo={contactInfo}
            onUpdate={(updatedContactInfo) => setContactInfo(updatedContactInfo)}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTab categories={categories} onUpdate={(updatedCategories) => setCategories(updatedCategories)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
