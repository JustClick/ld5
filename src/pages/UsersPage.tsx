import { useState, useEffect } from 'react'
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import Button from '../components/ui/Button'
import { useAuthStore } from '../stores/authStore'
import type { User } from '../types/auth'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { user: currentUser } = useAuthStore()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'))
        const querySnapshot = await getDocs(q)
        const fetchedUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[]
        setUsers(fetchedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: string, newRole: 'super_admin' | 'employee') => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole })
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const handleToggleActive = async (userId: string, currentlyActive: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { active: !currentlyActive })
      setUsers(users.map(user => 
        user.id === userId ? { ...user, active: !currentlyActive } : user
      ))
    } catch (error) {
      console.error('Error toggling user active status:', error)
    }
  }

  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">
          Access Denied
        </h2>
        <p className="mt-2 text-gray-600">
          You don't have permission to view this page.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all users in the system including their name, role, and status.
            </p>
          </div>
        </div>
        
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Department
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                          <div className="flex items-center">
                            <img
                              src={user.photoURL || 'https://via.placeholder.com/40'}
                              alt=""
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{user.displayName}</div>
                              <div className="text-gray-500">{user.jobTitle}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as 'super_admin' | 'employee')}
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            disabled={user.id === currentUser?.id}
                          >
                            <option value="employee">Employee</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {user.department || 'Not assigned'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          {user.id !== currentUser?.id && (
                            <Button
                              variant={user.active ? 'danger' : 'primary'}
                              onClick={() => handleToggleActive(user.id, !!user.active)}
                            >
                              {user.active ? 'Deactivate' : 'Activate'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}