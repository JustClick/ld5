import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useTimezoneStore } from '../../stores/timezoneStore'
import { ClockIcon } from '@heroicons/react/24/outline'

export default function DateTime() {
  const [date, setDate] = useState(new Date())
  const { timezone } = useTimezoneStore()

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    timeStyle: 'medium',
    timeZone: timezone
  }).format(date)

  const formattedDate = format(date, 'EEEE, MMMM d, yyyy')

  return (
    <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg shadow-sm">
      <ClockIcon className="h-5 w-5 text-gray-500" />
      <div>
        <div className="text-lg font-semibold text-gray-900">{formattedTime}</div>
        <div className="text-sm text-gray-600">{formattedDate}</div>
      </div>
    </div>
  )
}