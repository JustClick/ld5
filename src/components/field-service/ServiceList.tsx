import { useState, useEffect } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { FieldService } from '../../types/fieldService'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

export default function ServiceList() {
  const [services, setServices] = useState<FieldService[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const q = query(
        collection(db, 'fieldServices'),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const fetchedServices = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FieldService[]
      setServices(fetchedServices)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-200 rounded" />
      ))}
    </div>
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Field Services</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Work Code
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Step
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link 
                    to={`/field-service/${service.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {service.workCode}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${service.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  `}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.currentStep.toUpperCase()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(service.createdAt), 'MMM d, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(service.updatedAt), 'MMM d, yyyy HH:mm')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}