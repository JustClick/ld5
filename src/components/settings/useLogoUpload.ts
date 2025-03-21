import { useState, useRef } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../config/firebase'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'

export const useLogoUpload = () => {
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuthStore()

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || user?.role !== 'super_admin') return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB')
      return
    }

    try {
      setUploadingLogo(true)
      const id = toast.loading('Uploading logo...')

      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const logoRef = ref(storage, `app-assets/logo/logo-${timestamp}.${extension}`)
      
      await uploadBytes(logoRef, file)
      const downloadURL = await getDownloadURL(logoRef)

      await setDoc(doc(db, 'settings', 'app'), {
        logoURL: downloadURL,
        updatedAt: new Date().toISOString()
      }, { merge: true })

      toast.success('Logo updated successfully', { id })
    } catch (error: any) {
      console.error('Logo upload error:', error)
      const errorMessage = error.code === 'storage/unauthorized' 
        ? 'You do not have permission to upload the logo'
        : 'Failed to upload logo. Please try again.'
      toast.error(errorMessage)
    } finally {
      setUploadingLogo(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return {
    uploadingLogo,
    fileInputRef,
    handleLogoChange,
    canUpload: user?.role === 'super_admin'
  }
}