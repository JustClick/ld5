import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import Button from '../components/ui/Button'
import ImageUpload from '../components/profile/ImageUpload'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { toast } from 'react-hot-toast'

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    jobTitle: user?.jobTitle || '',
    department: user?.department || '',
    phoneNumber: user?.phoneNumber || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setLoading(true)
    try {
      const userRef = doc(db, 'users', user.id)
      await updateDoc(userRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      })

      setUser({
        ...user,
        ...formData
      })

      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-start space-x-6 mb-6">
            <ImageUpload />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.displayName || 'Your Profile'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Update your profile information and photo
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  id="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={user?.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Email cannot be changed
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={loading}
                disabled={loading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}