import { useForm } from 'react-hook-form'
import Button from '../ui/Button'

interface PreTripFormProps {
  initialData?: {
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
  onSubmit: (data: {
    vehicleId: string
    mileage: number
    fuelLevel: string
    tireCondition: string
    lightsWorking: boolean
    brakesFunctional: boolean
    fluidsChecked: boolean
    safetyEquipment: boolean
    damages?: string
  }) => void
  onBack: () => void
}

export default function PreTripForm({ initialData, onSubmit, onBack }: PreTripFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      vehicleId: '',
      mileage: 0,
      fuelLevel: '',
      tireCondition: '',
      lightsWorking: false,
      brakesFunctional: false,
      fluidsChecked: false,
      safetyEquipment: false,
      damages: ''
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vehicle ID
          </label>
          <input
            type="text"
            {...register('vehicleId', { required: 'Vehicle ID is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.vehicleId && (
            <p className="mt-1 text-sm text-red-600">{errors.vehicleId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Mileage
          </label>
          <input
            type="number"
            {...register('mileage', { required: 'Mileage is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.mileage && (
            <p className="mt-1 text-sm text-red-600">{errors.mileage.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fuel Level
        </label>
        <select
          {...register('fuelLevel', { required: 'Fuel level is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select fuel level</option>
          <option value="full">Full</option>
          <option value="3/4">3/4</option>
          <option value="1/2">1/2</option>
          <option value="1/4">1/4</option>
          <option value="empty">Empty</option>
        </select>
        {errors.fuelLevel && (
          <p className="mt-1 text-sm text-red-600">{errors.fuelLevel.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tire Condition
        </label>
        <select
          {...register('tireCondition', { required: 'Tire condition is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select tire condition</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
        {errors.tireCondition && (
          <p className="mt-1 text-sm text-red-600">{errors.tireCondition.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('lightsWorking')}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label className="ml-2 block text-sm text-gray-700">
            All lights are working properly
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('brakesFunctional')}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Brakes are functional
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('fluidsChecked')}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label className="ml-2 block text-sm text-gray-700">
            All fluids checked and filled
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('safetyEquipment')}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Safety equipment present and accessible
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Damages or Issues
        </label>
        <textarea
          {...register('damages')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Describe any damages or issues..."
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">
          Next: Journey Management
        </Button>
      </div>
    </form>
  )
}