import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageCircle } from "lucide-react"

interface ContactButtonsProps {
  property: {
    title: string
  }
  contactInfo: {
    phone_number: string
    email: string
    whatsapp_number: string
  }
}

export default function ContactButtons({ property, contactInfo }: ContactButtonsProps) {
  const whatsappLink = `https://wa.me/${contactInfo.whatsapp_number}?text=I%20am%20interested%20in%20${encodeURIComponent(property.title)}`
  const phoneLink = `tel:${contactInfo.phone_number}`
  const emailLink = `mailto:${contactInfo.email}?subject=Inquiry about ${encodeURIComponent(property.title)}`

  return (
    <div className="space-y-3">
      <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp Inquiry
        </a>
      </Button>

      <Button asChild variant="outline" className="w-full">
        <a href={phoneLink}>
          <Phone className="mr-2 h-4 w-4" />
          Call Us
        </a>
      </Button>

      <Button asChild variant="outline" className="w-full">
        <a href={emailLink}>
          <Mail className="mr-2 h-4 w-4" />
          Email Inquiry
        </a>
      </Button>
    </div>
  )
}
