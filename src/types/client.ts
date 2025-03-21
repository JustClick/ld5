export interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  taxId?: string
  paymentTerms: string
  notes?: string
  createdAt: string
  updatedAt: string
}