import { useState } from 'react'
import ClientsList from '../components/clients/ClientsList'
import ClientForm from '../components/clients/ClientForm'
import Button from '../components/ui/Button'

export default function ClientsPage() {
  const [showAddForm, setShowAddForm] = useState(false)

  if (showAddForm) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Add New Client</h2>
          </div>
          <ClientForm
            onSuccess={() => setShowAddForm(false)}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Clients</h2>
            <Button onClick={() => setShowAddForm(true)}>
              Add New Client
            </Button>
          </div>
          <ClientsList />
        </div>
      </div>
    </div>
  )
}