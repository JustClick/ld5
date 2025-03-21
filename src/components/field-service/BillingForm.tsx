import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../ui/Button'
import ClientSelect from '../clients/ClientSelect'
import ClientForm from '../clients/ClientForm'
import { toast } from 'react-hot-toast'

interface BillingFormProps {
  initialData?: {
    clientId: string
    serviceType: string
    hoursWorked: number
    ratePerHour: number
    materials?: string
    paymentTerms: string
    notes?: string
  }
  onSubmit: (data: {
    clientId: string
    serviceType: string
    hoursWorked: number
    ratePerHour: number
    materials?: string
    paymentTerms: string
    notes?: string
  }) => void
  onBack: () => void
  workCode: string
}

const SERVICE_TYPES = [
  'Cable Spooling',
  'CT Spooling',
  'Hot Shot',
  'Technical Services',
  'Other'
]

export default function BillingForm({ initialData, onSubmit, onBack, workCode }: BillingFormProps) {
  const [showClientForm, setShowClientForm] = useState(false)
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: initialData || {
      clientId: '',
      serviceType: '',
      hoursWorked: 0,
      ratePerHour: 0,
      materials: '',
      paymentTerms: '',
      notes: ''
    }
  })

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data)
      toast.success('Service completed successfully')
    } catch (error) {
      console.error('Error submitting service:', error)
      toast.error('Failed to complete service')
    }
  }

  const handleClientSuccess = (clientId: string) => {
    setValue('clientId', clientId)
    setShowClientForm(false)
  }

  if (showClientForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Add New Client</h2>
        </div>
        <ClientForm
          onSuccess={handleClientSuccess}
          onCancel={() => setShowClientForm(false)}
        />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-gray-50 px-4 py-2 rounded-md">
        <p className="text-sm text-gray-600">Work Code: <span className="font-medium">{workCode}</span></p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Client
          </label>
          <ClientSelect
            value={watch('clientId')}
            onChange={(clientId) => setValue('clientId', clientId)}
            onAddNew={() => setShowClientForm(true)}
          />
          {errors.clientId && (
            <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Service Type
          </label>
          <select
            {...register('serviceType', { required: 'Service type is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select service type</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.serviceType && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hours Worked
            </label>
            <input
              type="number"
              step="0.5"
              {...register('hoursWorked', { 
                required: 'Hours worked is required',
                min: { value: 0.5, message: 'Minimum 0.5 hours' }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.hoursWorked && (
              <p className="mt-1 text-sm text-red-600">{errors.hoursWorked.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rate per Hour ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('ratePerHour', { 
                required: 'Rate per hour is required',
                min: { value: 0, message: 'Rate must be positive' }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.ratePerHour && (
              <p className="mt-1 text-sm text-red-600">{errors.ratePerHour.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Materials Used
          </label>
          <textarea
            {...register('materials')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="List any materials used..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Terms
          </label>
          <select
            {...register('paymentTerms', { required: 'Payment terms are required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select payment terms</option>
            <option value="net15">Net 15</option>
            <option value="net30">Net 30</option>
            <option value="net45">Net 45</option>
            <option value="net60">Net 60</option>
          </select>
          {errors.paymentTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentTerms.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Any additional notes or special instructions..."
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">
          Submit Field Service
        </Button>
      </div>
    </form>
  )
}