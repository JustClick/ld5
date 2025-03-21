import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import WorkCodeModal from '../components/field-service/WorkCodeModal'
import ServiceList from '../components/field-service/ServiceList'
import Button from '../components/ui/Button'
import { useFieldServiceStore } from '../stores/fieldServiceStore'

export default function FieldServicePage() {
  const [isWorkCodeModalOpen, setWorkCodeModalOpen] = useState(false)
  const navigate = useNavigate()
  const { createService } = useFieldServiceStore()

  const handleWorkCodeSubmit = async (code: string) => {
    const service = await createService(code)
    setWorkCodeModalOpen(false)
    navigate(`/field-service/${service.id}`)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Field Services</h1>
        </div>
        <Button onClick={() => setWorkCodeModalOpen(true)}>
          New Field Service
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ServiceList />
        </div>
      </div>

      <WorkCodeModal
        isOpen={isWorkCodeModalOpen}
        onClose={() => setWorkCodeModalOpen(false)}
        onSubmit={handleWorkCodeSubmit}
      />
    </div>
  )
}