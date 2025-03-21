import { useForm } from 'react-hook-form'
import Button from '../ui/Button'

interface JSAFormProps {
  initialData?: {
    jobDescription: string
    hazards: string
    controls: string
    ppe: string[]
  }
  onSubmit: (data: {
    jobDescription: string
    hazards: string
    controls: string
    ppe: string[]
  }) => void
}

const PPE_OPTIONS = [
  'Hard Hat',
  'Safety Glasses',
  'Steel-Toed Boots',
  'Gloves',
  'High-Visibility Vest',
  'Hearing Protection',
  'Face Shield',
  'Fall Protection'
]

export default function JSAForm({ initialData, onSubmit }: JSAFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      jobDescription: '',
      hazards: '',
      controls: '',
      ppe: []
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Job Description
        </label>
        <textarea
          {...register('jobDescription', { required: 'Job description is required' })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.jobDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.jobDescription.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Potential Hazards
        </label>
        <textarea
          {...register('hazards', { required: 'Hazards identification is required' })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.hazards && (
          <p className="mt-1 text-sm text-red-600">{errors.hazards.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Control Measures
        </label>
        <textarea
          {...register('controls', { required: 'Control measures are required' })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.controls && (
          <p className="mt-1 text-sm text-red-600">{errors.controls.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Required PPE
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {PPE_OPTIONS.map((ppe) => (
            <label key={ppe} className="flex items-center">
              <input
                type="checkbox"
                {...register('ppe')}
                value={ppe}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">{ppe}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Next: Pre-Trip Check
        </Button>
      </div>
    </form>
  )
}