import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { FieldService } from '../types/fieldService'
import { createInvoiceFromService } from '../services/invoiceService'
import { toast } from 'react-hot-toast'

interface FieldServiceStore {
  currentService: FieldService | null
  setCurrentService: (service: FieldService | null) => void
  createService: (workCode: string) => Promise<FieldService>
  updateService: (serviceId: string, data: Partial<FieldService>) => Promise<void>
  loadService: (serviceId: string) => Promise<FieldService>
  completeService: (serviceId: string) => Promise<void>
}

export const useFieldServiceStore = create<FieldServiceStore>()(
  persist(
    (set, get) => ({
      currentService: null,

      setCurrentService: (service) => set({ currentService: service }),

      createService: async (workCode) => {
        const newService: Omit<FieldService, 'id'> = {
          workCode,
          status: 'open',
          currentStep: 'jsa',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        try {
          const docRef = await addDoc(collection(db, 'fieldServices'), newService)
          const service = { ...newService, id: docRef.id } as FieldService
          set({ currentService: service })
          return service
        } catch (error) {
          console.error('Error creating service:', error)
          toast.error('Failed to create service')
          throw error
        }
      },

      updateService: async (serviceId, data) => {
        const { currentService } = get()
        if (!currentService) return

        try {
          const updatedService = {
            ...currentService,
            ...data,
            updatedAt: new Date().toISOString()
          }

          await updateDoc(doc(db, 'fieldServices', serviceId), {
            ...data,
            updatedAt: updatedService.updatedAt
          })

          set({ currentService: updatedService })
        } catch (error) {
          console.error('Error updating service:', error)
          toast.error('Failed to update service')
          throw error
        }
      },

      loadService: async (serviceId) => {
        try {
          const docRef = doc(db, 'fieldServices', serviceId)
          const docSnap = await getDoc(docRef)
          
          if (!docSnap.exists()) {
            throw new Error('Service not found')
          }

          const service = { id: docSnap.id, ...docSnap.data() } as FieldService
          set({ currentService: service })
          return service
        } catch (error) {
          console.error('Error loading service:', error)
          toast.error('Failed to load service')
          throw error
        }
      },

      completeService: async (serviceId) => {
        const { currentService } = get()
        if (!currentService || !currentService.billingData) {
          throw new Error('Cannot complete service without billing data')
        }

        try {
          // Create invoice first
          const invoice = await createInvoiceFromService(currentService)

          // Then update service status
          await updateDoc(doc(db, 'fieldServices', serviceId), {
            status: 'closed',
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            invoiceId: invoice.id
          })

          set({
            currentService: {
              ...currentService,
              status: 'closed',
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              invoiceId: invoice.id
            }
          })

          toast.success('Service completed and invoice generated')
        } catch (error) {
          console.error('Error completing service:', error)
          toast.error('Failed to complete service')
          throw error
        }
      }
    }),
    {
      name: 'field-service-storage'
    }
  )
)