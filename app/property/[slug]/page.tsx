import { getProperty, getContactInfo } from "@/lib/api"
import PropertyGallery from "@/components/property/property-gallery"
import PropertyDetails from "@/components/property/property-details"
import ContactButtons from "@/components/property/contact-buttons"
import { notFound } from "next/navigation"

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  try {
    const property = await getProperty(params.slug)
    const contactInfo = await getContactInfo()

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyGallery images={property.images} />
            <PropertyDetails property={property} />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
                <p className="text-gray-600 mb-6">
                  Interested in this property? Reach out to us for more information or to schedule a viewing.
                </p>
                <ContactButtons property={property} contactInfo={contactInfo} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return notFound()
  }
}
