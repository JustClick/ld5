import { useState, useEffect } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Invoice } from '../types/invoice'
import { format } from 'date-fns'
import InvoiceDetails from '../components/accounting/InvoiceDetails'

export default function AccountingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [filter, setFilter] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const fetchedInvoices = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invoice[]
      setInvoices(fetchedInvoices)
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    if (filter !== 'all' && invoice.status !== filter) return false
    if (dateRange.start && new Date(invoice.date) < new Date(dateRange.start)) return false
    if (dateRange.end && new Date(invoice.date) > new Date(dateRange.end)) return false
    return true
  })

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)

  if (selectedInvoice) {
    return (
      <InvoiceDetails
        invoice={selectedInvoice}
        onClose={() => {
          setSelectedInvoice(null)
          fetchInvoices()
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Invoices</h2>
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Code
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">No invoices found</td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.workCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.clientCompany}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${invoice.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(invoice.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                        ${invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {filteredInvoices.length} invoices
          </div>
          <div className="text-lg font-semibold">
            Total: ${totalAmount.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}