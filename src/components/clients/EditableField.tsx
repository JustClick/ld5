import { useState } from 'react'

interface EditableFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel' | 'textarea'
}

export default function EditableField({ label, value, onChange, type = 'text' }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)

  const handleBlur = () => {
    setIsEditing(false)
    if (currentValue !== value) {
      onChange(currentValue)
    }
  }

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1">
        {isEditing ? (
          type === 'textarea' ? (
            <textarea
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onBlur={handleBlur}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
              autoFocus
            />
          ) : (
            <input
              type={type}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onBlur={handleBlur}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              autoFocus
            />
          )
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="text-sm text-gray-900 cursor-pointer hover:bg-gray-50 rounded p-1 -m-1"
          >
            {currentValue || 'Click to edit'}
          </div>
        )}
      </dd>
    </div>
  )
}