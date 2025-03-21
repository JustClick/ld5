import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Client } from '../types/client'
import ClientInfo from '../components/clients/ClientInfo'
import { toast } from 'react-hot-toast'

export default function ClientProfilePage() {
  const { id } = useParams()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return
      try {
        const docRef = doc(db, 'clients', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setClient({ id: docSnap.id, ...docSnap.data() } as Client)
        }
      } catch (error) {
        console.error('Error fetching client:', error)
        toast.error('Failed to load client information')
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [id])

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  }

  if (!client) {
    return <div className="text-center py-4 text-gray-500">Client not found</div>
  }

  return <ClientInfo client={client} onUpdate={setClient} />
}