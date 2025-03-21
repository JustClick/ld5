import { collection, addDoc, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { FieldService } from '../types/fieldService'
import { Invoice } from '../types/invoice'
import { Client } from '../types/client'

export const createInvoiceFromService = async (service: FieldService): Promise<Invoice> => {
  if (!service.billingData) {
    throw new Error('Service billing data is required')
  }

  try {
    // Get client information
    const clientRef = doc(db, 'clients', service.billingData.clientId)
    const clientSnap = await getDoc(clientRef)
    
    if (!clientSnap.exists()) {
      throw new Error('Client not found')
    }
    
    const client = clientSnap.data() as Client

    // Get the next invoice number
    const lastInvoiceQuery = query(
      collection(db, 'invoices'),
      orderBy('invoiceNumber', 'desc'),
      limit(1)
    )
    const lastInvoiceSnapshot = await getDocs(lastInvoiceQuery)
    let nextNumber = 1000 // Start from 1000 if no invoices exist
    
    if (!lastInvoiceSnapshot.empty) {
      const lastInvoice = lastInvoiceSnapshot.docs[0].data()
      nextNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1]) + 1
    }

    const invoiceNumber = `INV-${nextNumber.toString().padStart(4, '0')}`
    const { billingData, workCode } = service
    const amount = billingData.hoursWorked * billingData.ratePerHour

    const invoice: Omit<Invoice, 'id'> = {
      invoiceNumber,
      workCode,
      clientId: billingData.clientId,
      clientName: client.name,
      clientCompany: client.company,
      clientEmail: client.email,
      clientPhone: client.phone,
      clientAddress: client.address,
      serviceType: billingData.serviceType,
      amount,
      materials: billingData.materials || '',
      paymentTerms: billingData.paymentTerms,
      status: 'pending' as const,
      date: new Date().toISOString(),
      dueDate: calculateDueDate(billingData.paymentTerms),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      details: {
        hoursWorked: billingData.hoursWorked,
        ratePerHour: billingData.ratePerHour
      },
      notes: billingData.notes || ''
    }

    const docRef = await addDoc(collection(db, 'invoices'), invoice)
    return { ...invoice, id: docRef.id }
  } catch (error) {
    console.error('Error creating invoice:', error)
    throw error
  }
}

const calculateDueDate = (paymentTerms: string): string => {
  const days = parseInt(paymentTerms.replace('net', ''))
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + days)
  return dueDate.toISOString()
}