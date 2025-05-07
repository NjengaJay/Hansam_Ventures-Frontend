// API service functions to interact with the Django backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    // Try to get error details from the response
    try {
      const errorData = await response.json()
      throw new Error(JSON.stringify(errorData))
    } catch (e) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
  }

  // Check if the response is empty
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return await response.json()
  }

  return null
}

// Helper function to get auth headers
function getAuthHeaders() {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null

  return {
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    "Content-Type": "application/json",
  }
}

// Authentication
export async function login(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/admin/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  return handleResponse(response)
}

export async function refreshToken(refreshToken: string) {
  const response = await fetch(`${API_BASE_URL}/admin/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  })

  return handleResponse(response)
}

// Properties
export async function getProperties(filters: Record<string, any>) {
  // Build query string from filters
  const queryParams = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString())
    }
  })

  const queryString = queryParams.toString()
  const url = `${API_BASE_URL}/properties${queryString ? `?${queryString}` : ""}`

  // Use server-side fetch for initial page load
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers")
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
    return handleResponse(response)
  }

  // Use client-side fetch for client components
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  })

  return handleResponse(response)
}

export async function getProperty(slug: string) {
  // Use server-side fetch for initial page load
  if (typeof window === "undefined") {
    const response = await fetch(`${API_BASE_URL}/properties/${slug}/`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
    return handleResponse(response)
  }

  // Use client-side fetch for client components
  const response = await fetch(`${API_BASE_URL}/properties/${slug}/`, {
    headers: {
      "Content-Type": "application/json",
    },
  })

  return handleResponse(response)
}

export async function createProperty(propertyData: FormData) {
  const response = await fetch(`${API_BASE_URL}/properties/`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeaders().Authorization,
      // Don't set Content-Type for FormData, browser will set it with boundary
    },
    body: propertyData,
  })

  return handleResponse(response)
}

export async function updateProperty(propertyId: number, propertyData: FormData) {
  const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/`, {
    method: "PUT",
    headers: {
      Authorization: getAuthHeaders().Authorization,
      // Don't set Content-Type for FormData, browser will set it with boundary
    },
    body: propertyData,
  })

  return handleResponse(response)
}

export async function deleteProperty(propertyId: number) {
  // Get property details using the list endpoint with a filter
  const response = await fetch(`${API_BASE_URL}/properties/?id=${propertyId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await handleResponse(response)
  const property = data.results?.[0]
  
  if (!property) {
    throw new Error("Property not found")
  }

  // Then delete using the slug
  const deleteResponse = await fetch(`${API_BASE_URL}/properties/${property.slug}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })

  return handleResponse(deleteResponse)
}

// Contact Info
export async function getContactInfo() {
  // Use server-side fetch for initial page load
  if (typeof window === "undefined") {
    const response = await fetch(`${API_BASE_URL}/contact-info/`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
    return handleResponse(response)
  }

  // Use client-side fetch for client components
  const response = await fetch(`${API_BASE_URL}/contact-info/`, {
    headers: {
      "Content-Type": "application/json",
    },
  })

  return handleResponse(response)
}

export async function updateContactInfo(contactInfoId: number, contactInfoData: any) {
  const response = await fetch(`${API_BASE_URL}/contact-info/${contactInfoId}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(contactInfoData),
  })

  return handleResponse(response)
}

// Categories
export async function getCategories() {
  // Use server-side fetch for initial page load
  if (typeof window === "undefined") {
    const response = await fetch(`${API_BASE_URL}/categories/`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
    return handleResponse(response)
  }

  // Use client-side fetch for client components
  const response = await fetch(`${API_BASE_URL}/categories/`, {
    headers: {
      "Content-Type": "application/json",
    },
  })

  return handleResponse(response)
}

export async function createCategory(categoryData: any) {
  const response = await fetch(`${API_BASE_URL}/categories/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  })

  return handleResponse(response)
}

export async function updateCategory(categoryId: number, categoryData: any) {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  })

  return handleResponse(response)
}

export async function deleteCategory(categoryId: number) {
  // Get category details using the list endpoint with a filter
  const response = await fetch(`${API_BASE_URL}/categories/?id=${categoryId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await handleResponse(response)
  const category = data.results?.[0]
  
  if (!category) {
    throw new Error("Category not found")
  }

  // Check if category has any properties
  const propertiesResponse = await fetch(`${API_BASE_URL}/properties/?category=${categoryId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  const propertiesData = await handleResponse(propertiesResponse)
  
  if (propertiesData.results?.length > 0) {
    throw new Error("Cannot delete category that has properties. Please delete or reassign the properties first.")
  }

  // Then delete using the slug
  const deleteResponse = await fetch(`${API_BASE_URL}/categories/${category.slug}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })

  return handleResponse(deleteResponse)
}
