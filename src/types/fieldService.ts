export type FieldServiceStatus = 'open' | 'closed'

export interface FieldService {
  id: string
  workCode: string
  status: FieldServiceStatus
  currentStep: 'jsa' | 'pre-trip' | 'journey' | 'billing'
  createdAt: string
  updatedAt: string
  completedAt?: string
  invoiceId?: string
  
  // JSA Data
  jsaData?: {
    jobDescription: string
    hazards: string
    controls: string
    ppe: string[]
  }
  
  // Pre-Trip Data
  preTripData?: {
    vehicleId: string
    mileage: number
    fuelLevel: string
    tireCondition: string
    lightsWorking: boolean
    brakesFunctional: boolean
    fluidsChecked: boolean
    safetyEquipment: boolean
    damages?: string
  }
  
  // Journey Data
  journeyData?: {
    startLocation: string
    endLocation: string
    startTime: string
    estimatedEndTime: string
    fuelExpense: number
    foodExpense: number
    otherExpenses: number
    notes?: string
  }
  
  // Billing Data
  billingData?: {
    clientId: string
    serviceType: string
    hoursWorked: number
    ratePerHour: number
    materials?: string
    paymentTerms: string
    notes?: string
  }
}