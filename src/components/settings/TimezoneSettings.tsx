import { useState } from 'react'
import { Combobox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { useTimezoneStore } from '../../stores/timezoneStore'
import { TIMEZONES } from '../../constants/timezones'

interface TimezoneSettingsProps {
  timezone: string
  onChange: (timezone: string) => void
}

export default function TimezoneSettings({ timezone, onChange }: TimezoneSettingsProps) {
  const { setTimezone } = useTimezoneStore()
  const [query, setQuery] = useState('')
  const [selectedTimezone, setSelectedTimezone] = useState(
    TIMEZONES.find(tz => tz.value === timezone) || TIMEZONES[0]
  )

  const filteredTimezones = query === ''
    ? TIMEZONES
    : TIMEZONES.filter((tz) =>
        tz.label.toLowerCase().includes(query.toLowerCase())
      )

  const handleTimezoneChange = (newTimezone: typeof TIMEZONES[0]) => {
    setSelectedTimezone(newTimezone)
    onChange(newTimezone.value)
    setTimezone(newTimezone.value)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Timezone</h3>
      <Combobox value={selectedTimezone} onChange={handleTimezoneChange}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(tz: typeof TIMEZONES[0]) => tz.label}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredTimezones.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredTimezones.map((tz) => (
                <Combobox.Option
                  key={tz.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={tz}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {tz.label}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-indigo-600'
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  )
}