import { addDoc, collection, getDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { FieldService } from '../types/fieldService'
import { Invoice } from '../types/invoice'

export const createInvoiceFromService = async (service: FieldService) => {
  if (!service.billingData || !service.completedAt) {
    throw new Error('Invalid service data for invoice generation')
  }

  try {
    const { billingData, workCode, completedAt } = service
    const { clientId, serviceType, hoursWorked, ratePerHour, materials, paymentTerms, notes } = billingData

    // Get client details
    const clientDoc = await getDoc(doc(db, 'clients', clientId))
    if (!clientDoc.exists()) {
      throw new Error('Client not found')
    }
    const client = clientDoc.data()

    const totalAmount = hoursWorked * ratePerHour

    const invoice: Omit<Invoice, 'id'> = {
      invoiceNumber: `INV-${Date.now()}`,
      workCode,
      clientId,
      clientName: client.name,
      clientCompany: client.company,
      clientEmail: client.email,
      clientPhone: client.phone,
      clientAddress: client.address,
      serviceType,
      amount: totalAmount,
      materials: materials || '',
      paymentTerms,
      status: 'pending' as const,
      date: completedAt,
      dueDate: calculateDueDate(completedAt, paymentTerms),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      details: {
        hoursWorked,
        ratePerHour
      },
      notes: notes || ''
    }

    const docRef = await addDoc(collection(db, 'invoices'), invoice)
    return { ...invoice, id: docRef.id }
  } catch (error) {
    console.error('Error creating invoice:', error)
    throw error
  }
}

const calculateDueDate = (date: string, paymentTerms: string): string => {
  const days = parseInt(paymentTerms.replace('net', ''))
  const dueDate = new Date(date)
  dueDate.setDate(dueDate.getDate() + days)
  return dueDate.toISOString()
}