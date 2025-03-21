import { useState, useCallback } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { Client } from '../../types/client'
import { format } from 'date-fns'
import EditableField from './EditableField'
import Button from '../ui/Button'
import { toast } from 'react-hot-toast'

interface ClientInfoProps {
  client: Client
  onUpdate: (updatedClient: Client) => void
}

export default function ClientInfo({ client, onUpdate }: ClientInfoProps) {
  const [changes, setChanges] = useState<Partial<Client>>({})
  const [saving, setSaving] = useState(false)

  const handleFieldChange = useCallback((field: string, value: string) => {
    setChanges(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const handleAddressChange = useCallback((field: string, value: string) => {
    setChanges(prev => ({
      ...prev,
      address: {
        ...(prev.address || client.address),
        [field]: value
      }
    }))
  }, [client.address])

  const hasChanges = Object.keys(changes).length > 0

  const handleSave = async () => {
    if (!hasChanges) return

    setSaving(true)
    try {
      const updatedClient = {
        ...client,
        ...changes,
        updatedAt: new Date().toISOString()
      }

      await updateDoc(doc(db, 'clients', client.id), {
        ...changes,
        updatedAt: updatedClient.updatedAt
      })

      onUpdate(updatedClient)
      setChanges({})
      toast.success('Client updated successfully')
    } catch (error) {
      console.error('Error updating client:', error)
      toast.error('Failed to update client')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{client.company}</h2>
          {hasChanges && (
            <Button onClick={handleSave} isLoading={saving}>
              Save Changes
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <dl className="space-y-3">
              <EditableField
                label="Contact Name"
                value={changes.name ?? client.name}
                onChange={(value) => handleFieldChange('name', value)}
              />
              <EditableField
                label="Email"
                value={changes.email ?? client.email}
                onChange={(value) => handleFieldChange('email', value)}
                type="email"
              />
              <EditableField
                label="Phone"
                value={changes.phone ?? client.phone}
                onChange={(value) => handleFieldChange('phone', value)}
                type="tel"
              />
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
            <dl className="space-y-3">
              <EditableField
                label="Street"
                value={changes.address?.street ?? client.address.street}
                onChange={(value) => handleAddressChange('street', value)}
              />
              <EditableField
                label="City"
                value={changes.address?.city ?? client.address.city}
                onChange={(value) => handleAddressChange('city', value)}
              />
              <EditableField
                label="State"
                value={changes.address?.state ?? client.address.state}
                onChange={(value) => handleAddressChange('state', value)}
              />
              <EditableField
                label="ZIP Code"
                value={changes.address?.zipCode ?? client.address.zipCode}
                onChange={(value) => handleAddressChange('zipCode', value)}
              />
              <EditableField
                label="Country"
                value={changes.address?.country ?? client.address.country}
                onChange={(value) => handleAddressChange('country', value)}
              />
            </dl>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EditableField
              label="Tax ID"
              value={changes.taxId ?? client.taxId ?? ''}
              onChange={(value) => handleFieldChange('taxId', value)}
            />
            <EditableField
              label="Payment Terms"
              value={changes.paymentTerms ?? client.paymentTerms}
              onChange={(value) => handleFieldChange('paymentTerms', value)}
            />
            <div className="md:col-span-2">
              <EditableField
                label="Notes"
                value={changes.notes ?? client.notes ?? ''}
                onChange={(value) => handleFieldChange('notes', value)}
                type="textarea"
              />
            </div>
          </dl>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Created</dt>
              <dd className="text-gray-900">{format(new Date(client.createdAt), 'PPP')}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Last Updated</dt>
              <dd className="text-gray-900">{format(new Date(client.updatedAt), 'PPP')}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}