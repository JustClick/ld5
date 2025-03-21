import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { Client } from '../../types/client'
import { TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

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
      toast.error('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteDoc(doc(db, 'clients', clientId))
        setClients(clients.filter(client => client.id !== clientId))
        toast.success('Client deleted successfully')
      } catch (error) {
        console.error('Error deleting client:', error)
        toast.error('Failed to delete client')
      }
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded" />
        ))}
      </div>
    )
  }

  if (clients.length === 0) {
    return <p className="text-gray-500 text-center py-4">No clients found</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <Link 
                  to={`/clients/${client.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  {client.company}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleDelete(client.id)}
                  className="text-red-600 hover:text-red-900 ml-4"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}