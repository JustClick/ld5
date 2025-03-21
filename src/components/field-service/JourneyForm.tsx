import { useForm } from 'react-hook-form'
import Button from '../ui/Button'

interface JourneyFormProps {
  initialData?: {
    startLocation: string
    endLocation: string
    startTime: string
    estimatedEndTime: string
    fuelExpense: number
    foodExpense: number
    otherExpenses: number
    notes?: string
  }
  onSubmit: (data: {
    startLocation: string
    endLocation: string
    startTime: string
    estimatedEndTime: string
    fuelExpense: number
    foodExpense: number
    otherExpenses: number
    notes?: string
  }) => Promise<void>
  onBack: () => void
}

export default function JourneyForm({ initialData, onSubmit, onBack }: JourneyFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      startLocation: '',
      endLocation: '',
      startTime: '',
      estimatedEndTime: '',
      fuelExpense: 0,
      foodExpense: 0,
      otherExpenses: 0,
      notes: ''
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Location
          </label>
          <input
            type="text"
            {...register('startLocation', { required: 'Start location is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.startLocation && (
            <p className="mt-1 text-sm text-red-600">{errors.startLocation.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Location
          </label>
          <input
            type="text"
            {...register('endLocation', { required: 'End location is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.endLocation && (
            <p className="mt-1 text-sm text-red-600">{errors.endLocation.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="datetime-local"
            {...register('startTime', { required: 'Start time is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estimated End Time
          </label>
          <input
            type="datetime-local"
            {...register('estimatedEndTime', { required: 'Estimated end time is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.estimatedEndTime && (
            <p className="mt-1 text-sm text-red-600">{errors.estimatedEndTime.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fuel Expense ($)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('fuelExpense', { required: 'Fuel expense is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.fuelExpense && (
            <p className="mt-1 text-sm text-red-600">{errors.fuelExpense.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Food Expense ($)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('foodExpense', { required: 'Food expense is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.foodExpense && (
            <p className="mt-1 text-sm text-red-600">{errors.foodExpense.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Other Expenses ($)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('otherExpenses')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Additional notes or comments..."
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">
          Next: Billing
        </Button>
      </div>
    </form>
  )
}