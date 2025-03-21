export interface Invoice {
  id: string
  invoiceNumber: string
  workCode: string
  clientId: string
  clientName: string
  clientCompany: string
  clientEmail: string
  clientPhone: string
  clientAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  serviceType: string
  amount: number
  materials?: string
  paymentTerms: string
  status: 'pending' | 'paid' | 'overdue'
  date: string
  dueDate: string
  createdAt: string
  updatedAt: string
  details: {
    hoursWorked: number
    ratePerHour: number
  }
  notes?: string
}