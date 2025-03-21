import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import Button from '../components/ui/Button'
import { useAuthStore } from '../stores/authStore'
import { toast } from 'react-hot-toast'
import NotificationSettings from '../components/settings/NotificationSettings'
import ThemeSettings from '../components/settings/ThemeSettings'
import TimezoneSettings from '../components/settings/TimezoneSettings'

type Theme = 'light' | 'dark' | 'system'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      inAppNotifications: true,
    },
    theme: 'system' as Theme,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const handleThemeChange = (theme: Theme) => {
    setSettings(prev => ({
      ...prev,
      theme
    }))
  }

  const handleTimezoneChange = (timezone: string) => {
    setSettings(prev => ({
      ...prev,
      timezone
    }))
  }

  const handleSave = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const userRef = doc(db, 'users', user.id)
      await updateDoc(userRef, {
        settings,
        updatedAt: new Date().toISOString()
      })
      toast.success('Settings updated successfully')
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
          
          <div className="space-y-8">
            <NotificationSettings 
              settings={settings.notifications}
              onChange={handleNotificationChange}
            />

            <ThemeSettings 
              theme={settings.theme}
              onChange={handleThemeChange}
            />

            <TimezoneSettings 
              timezone={settings.timezone}
              onChange={handleTimezoneChange}
            />

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                isLoading={loading}
                disabled={loading}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}