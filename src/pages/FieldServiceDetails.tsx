import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFieldServiceStore } from '../stores/fieldServiceStore'
import JSAForm from '../components/field-service/JSAForm'
import PreTripForm from '../components/field-service/PreTripForm'
import JourneyForm from '../components/field-service/JourneyForm'
import BillingForm from '../components/field-service/BillingForm'
import { toast } from 'react-hot-toast'
import type { FieldService } from '../types/fieldService'

export default function FieldServiceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentService, loadService, updateService, completeService } = useFieldServiceStore()

  useEffect(() => {
    if (id) {
      loadService(id).catch(error => {
        console.error('Error loading service:', error)
        toast.error('Failed to load service details')
        navigate('/field-service')
      })
    }
  }, [id, loadService, navigate])

  const handleNextStep = async () => {
    if (!currentService) return

    const steps: FieldService['currentStep'][] = ['jsa', 'pre-trip', 'journey', 'billing']
    const currentIndex = steps.indexOf(currentService.currentStep)
    
    if (currentIndex < steps.length - 1) {
      await updateService(currentService.id, {
        currentStep: steps[currentIndex + 1]
      })
    }
  }

  const handlePreviousStep = async () => {
    if (!currentService) return

    const steps: FieldService['currentStep'][] = ['jsa', 'pre-trip', 'journey', 'billing']
    const currentIndex = steps.indexOf(currentService.currentStep)
    
    if (currentIndex > 0) {
      await updateService(currentService.id, {
        currentStep: steps[currentIndex - 1]
      })
    }
  }

  if (!currentService) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Work Code: {currentService.workCode}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Status: {currentService.status.toUpperCase()}
              </p>
            </div>
          </div>

          {currentService.currentStep === 'jsa' && (
            <JSAForm
              initialData={currentService.jsaData}
              onSubmit={async (data) => {
                await updateService(currentService.id, { jsaData: data })
                handleNextStep()
              }}
            />
          )}

          {currentService.currentStep === 'pre-trip' && (
            <PreTripForm
              initialData={currentService.preTripData}
              onSubmit={async (data) => {
                await updateService(currentService.id, { preTripData: data })
                handleNextStep()
              }}
              onBack={handlePreviousStep}
            />
          )}

          {currentService.currentStep === 'journey' && (
            <JourneyForm
              initialData={currentService.journeyData}
              onSubmit={async (data) => {
                await updateService(currentService.id, { journeyData: data })
                handleNextStep()
              }}
              onBack={handlePreviousStep}
            />
          )}

          {currentService.currentStep === 'billing' && (
            <BillingForm
              initialData={currentService.billingData}
              onSubmit={async (data) => {
                await updateService(currentService.id, { billingData: data })
                await completeService(currentService.id)
                navigate('/field-service')
              }}
              onBack={handlePreviousStep}
              workCode={currentService.workCode}
            />
          )}
        </div>
      </div>
    </div>
  )
}