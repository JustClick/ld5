import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { Invoice } from '../../types/invoice'
import { format } from 'date-fns'
import Button from '../ui/Button'
import { toast } from 'react-hot-toast'

interface InvoiceDetailsProps {
  invoice: Invoice
  onClose: () => void
}

export default function InvoiceDetails({ invoice, onClose }: InvoiceDetailsProps) {
  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState(invoice.amount)
  const [status, setStatus] = useState(invoice.status)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateDoc(doc(db, 'invoices', invoice.id), {
        amount,
        status,
        updatedAt: new Date().toISOString()
      })
      toast.success('Invoice updated successfully')
      onClose()
    } catch (error) {
      console.error('Error updating invoice:', error)
      toast.error('Failed to update invoice')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Invoice {invoice.invoiceNumber}
        </h2>
        <div className="space-x-4">
          {editing ? (
            <>
              <Button variant="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} isLoading={saving}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={onClose}>
                Back to List
              </Button>
              <Button onClick={() => setEditing(true)}>
                Edit Invoice
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Company</dt>
              <dd className="text-sm text-gray-900">{invoice.clientCompany}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Contact</dt>
              <dd className="text-sm text-gray-900">{invoice.clientName}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Service Details</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Work Code</dt>
              <dd className="text-sm text-gray-900">{invoice.workCode}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Service Type</dt>
              <dd className="text-sm text-gray-900">{invoice.serviceType}</dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Details</h3>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Hours Worked</dt>
              <dd className="text-sm text-gray-900">{invoice.details.hoursWorked}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rate per Hour</dt>
              <dd className="text-sm text-gray-900">${invoice.details.ratePerHour}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Amount</dt>
              <dd className="text-sm text-gray-900">
                {editing ? (
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                ) : (
                  `$${invoice.amount.toFixed(2)}`
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Dates</h3>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="text-sm text-gray-900">
                {editing ? (
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Invoice['status'])}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                    ${invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Invoice Date</dt>
              <dd className="text-sm text-gray-900">
                {format(new Date(invoice.date), 'MMM d, yyyy')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Due Date</dt>
              <dd className="text-sm text-gray-900">
                {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}