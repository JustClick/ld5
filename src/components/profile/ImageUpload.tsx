import { useRef, useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuthStore } from '../../stores/authStore'
import { uploadImage, validateFile } from '../../utils/storage'
import { toast } from 'react-hot-toast'

export default function ImageUpload() {
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, setUser } = useAuthStore()

  const handleImageClick = () => {
    if (!uploadingImage) {
      fileInputRef.current?.click()
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return

    try {
      validateFile(file, { maxSizeMB: 5, allowedTypes: ['image/jpeg', 'image/png'] })
      
      setUploadingImage(true)
      const id = toast.loading('Uploading image...')

      const imagePath = `profile-images/${user.id}/${Date.now()}_${file.name}`
      const downloadURL = await uploadImage(
        file,
        imagePath,
        (progress) => {
          toast.loading(`Uploading: ${Math.round(progress)}%`, { id })
        }
      )

      const userRef = doc(db, 'users', user.id)
      await updateDoc(userRef, {
        photoURL: downloadURL,
        updatedAt: new Date().toISOString()
      })

      setUser({
        ...user,
        photoURL: downloadURL
      })

      toast.success('Profile image updated successfully', { id })
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div 
      className="relative group cursor-pointer" 
      onClick={handleImageClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleImageClick()
        }
      }}
    >
      <div className="relative w-24 h-24">
        <img
          src={user?.photoURL || 'https://via.placeholder.com/100'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all duration-200">
          <svg 
            className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        {uploadingImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  )
}