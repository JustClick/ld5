import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuthStore } from '../stores/authStore'
import { format } from 'date-fns'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        // Fetch recent field services
        const servicesQuery = query(
          collection(db, 'fieldServices'),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
        const servicesSnapshot = await getDocs(servicesQuery)
        const services = servicesSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'service',
          createdAt: doc.data().createdAt,
          ...doc.data()
        }))

        // Fetch recent invoices
        const invoicesQuery = query(
          collection(db, 'invoices'),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
        const invoicesSnapshot = await getDocs(invoicesQuery)
        const invoices = invoicesSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'invoice',
          createdAt: doc.data().createdAt,
          ...doc.data()
        }))

        // Combine and sort by date
        const combined = [...services, ...invoices]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)

        setRecentActivity(combined)
      } catch (error) {
        console.error('Error fetching recent activity:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivity()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome back, {user?.displayName || 'User'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/field-service" className="block">
          <div className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition-colors">
            <h3 className="text-lg font-medium text-blue-900">Field Services</h3>
            <p className="text-blue-600 mt-2">View and manage field services</p>
          </div>
        </Link>
        
        {user?.role === 'super_admin' && (
          <Link to="/accounting" className="block">
            <div className="bg-green-50 p-6 rounded-lg hover:bg-green-100 transition-colors">
              <h3 className="text-lg font-medium text-green-900">Accounting</h3>
              <p className="text-green-600 mt-2">Track invoices and payments</p>
            </div>
          </Link>
        )}
        
        {user?.role === 'super_admin' && (
          <Link to="/users" className="block">
            <div className="bg-purple-50 p-6 rounded-lg hover:bg-purple-100 transition-colors">
              <h3 className="text-lg font-medium text-purple-900">Users</h3>
              <p className="text-purple-600 mt-2">Manage team members</p>
            </div>
          </Link>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded" />
            ))}
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.type === 'service' ? (
                      <>Field Service: {activity.workCode}</>
                    ) : (
                      <>Invoice: ${activity.amount.toFixed(2)}</>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {activity.status.toUpperCase()}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {format(new Date(activity.createdAt), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent activity</p>
        )}
      </div>
    </div>
  )
}