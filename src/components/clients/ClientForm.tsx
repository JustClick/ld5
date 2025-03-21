import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { Client } from '../../types/client'
import Button from '../ui/Button'
import { toast } from 'react-hot-toast'

interface ClientFormProps {
  onSuccess: (clientId: string) => void
  onCancel: () => void
}

export default function ClientForm({ onSuccess, onCancel }: ClientFormProps) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>()

  const onSubmit = async (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true)
    try {
      const docRef = await addDoc(collection(db, 'clients'), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      toast.success('Client added successfully')
      onSuccess(docRef.id)
    } catch (error) {
      console.error('Error adding client:', error)
      toast.error('Failed to add client')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            {...register('company', { required: 'Company name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Name</label>
          <input
            type="text"
            {...register('name', { required: 'Contact name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            {...register('phone', { required: 'Phone is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Street Address</label>
          <input
            type="text"
            {...register('address.street', { required: 'Street address is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            {...register('address.city', { required: 'City is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            {...register('address.state', { required: 'State is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
          <input
            type="text"
            {...register('address.zipCode', { required: 'ZIP code is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            {...register('address.country', { required: 'Country is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tax ID</label>
          <input
            type="text"
            {...register('taxId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
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
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            {...register('notes')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          Add Client
        </Button>
      </div>
    </form>
  )
}