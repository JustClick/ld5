import { RadioGroup } from '@headlessui/react'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { useThemeStore } from '../../stores/themeStore'

type Theme = 'light' | 'dark' | 'system'

interface ThemeSettingsProps {
  theme: Theme
  onChange: (theme: Theme) => void
}

const themes = [
  {
    name: 'Light',
    value: 'light',
    icon: SunIcon,
    description: 'Use light theme'
  },
  {
    name: 'Dark',
    value: 'dark',
    icon: MoonIcon,
    description: 'Use dark theme'
  },
  {
    name: 'System',
    value: 'system',
    icon: ComputerDesktopIcon,
    description: 'Match system theme'
  }
]

export default function ThemeSettings({ theme, onChange }: ThemeSettingsProps) {
  const { setTheme } = useThemeStore()

  const handleThemeChange = (newTheme: Theme) => {
    onChange(newTheme)
    setTheme(newTheme)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Theme</h3>
      <RadioGroup value={theme} onChange={handleThemeChange} className="mt-2 space-y-3">
        <div className="space-y-3">
          {themes.map((themeOption) => (
            <RadioGroup.Option
              key={themeOption.value}
              value={themeOption.value}
              className={({ checked }) => `
                relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none
                ${checked ? 'bg-indigo-600 text-white' : 'bg-white'}
              `}
            >
              {({ checked }) => (
                <>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`font-medium ${
                            checked ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {themeOption.name}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="span"
                          className={`inline ${
                            checked ? 'text-indigo-100' : 'text-gray-500'
                          }`}
                        >
                          {themeOption.description}
                        </RadioGroup.Description>
                      </div>
                    </div>
                    <div className={`shrink-0 text-white ${checked ? 'text-white' : 'text-indigo-600'}`}>
                      <themeOption.icon className="h-6 w-6" />
                    </div>
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}