import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Button from '../ui/Button'

interface WorkCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (code: string) => void
}

export default function WorkCodeModal({ isOpen, onClose, onSubmit }: WorkCodeModalProps) {
  const [code, setCode] = useState('')
  const [isNew, setIsNew] = useState<boolean | null>(null)

  const generateWorkCode = () => {
    const random = Math.floor(1000 + Math.random() * 9000)
    setCode(random.toString())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(code)
    setCode('')
    setIsNew(null)
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    Work Code
                  </Dialog.Title>
                  
                  {isNew === null ? (
                    <div className="mt-4 space-y-4">
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => setIsNew(false)}
                      >
                        Enter Existing Work Code
                      </Button>
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => {
                          setIsNew(true)
                          generateWorkCode()
                        }}
                      >
                        Generate New Work Code
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          {isNew ? 'Generated Work Code' : 'Enter Work Code'}
                        </label>
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          maxLength={4}
                          required
                          readOnly={isNew}
                        />
                      </div>
                      <div className="mt-6 flex justify-end gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setIsNew(null)}
                        >
                          Back
                        </Button>
                        <Button type="submit">
                          Continue
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}