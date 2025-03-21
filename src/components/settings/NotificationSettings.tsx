import { Switch } from '@headlessui/react'
import { BellIcon, DevicePhoneMobileIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

interface NotificationSettingsProps {
  settings: {
    emailNotifications: boolean
    pushNotifications: boolean
    inAppNotifications: boolean
  }
  onChange: (key: string, value: boolean) => void
}

export default function NotificationSettings({ settings, onChange }: NotificationSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email updates about your account</p>
            </div>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onChange={(checked) => onChange('emailNotifications', checked)}
            className={`${
              settings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Enable email notifications</span>
            <span
              className={`${
                settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive push notifications on your device</p>
            </div>
          </div>
          <Switch
            checked={settings.pushNotifications}
            onChange={(checked) => onChange('pushNotifications', checked)}
            className={`${
              settings.pushNotifications ? 'bg-indigo-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Enable push notifications</span>
            <span
              className={`${
                settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BellIcon className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">In-App Notifications</p>
              <p className="text-sm text-gray-500">Receive notifications within the application</p>
            </div>
          </div>
          <Switch
            checked={settings.inAppNotifications}
            onChange={(checked) => onChange('inAppNotifications', checked)}
            className={`${
              settings.inAppNotifications ? 'bg-indigo-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Enable in-app notifications</span>
            <span
              className={`${
                settings.inAppNotifications ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>
      </div>
    </div>
  )
}