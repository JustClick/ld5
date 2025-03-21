import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { Client } from '../../types/client'
import Button from '../ui/Button'

interface ClientSelectProps {
  value: string
  onChange: (clientId: string) => void
  onAddNew: () => void
}

export default function ClientSelect({ value, onChange, onAddNew }: ClientSelectProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'clients'))
        const fetchedClients = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Client[]
        setClients(fetchedClients)
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  if (loading) {
    return <div className="animate-pulse h-10 bg-gray-200 rounded-md" />
  }

  return (
    <div className="space-y-4">
      {clients.length > 0 ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} - {client.company}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-sm text-gray-500">No clients found</p>
      )}
      
      <Button
        type="button"
        variant="secondary"
        onClick={onAddNew}
        className="w-full"
      >
        Add New Client
      </Button>
    </div>
  )
}