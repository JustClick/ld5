import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../config/firebase'

interface UploadOptions {
  maxSizeMB?: number
  allowedTypes?: string[]
}

export const validateFile = (file: File, options: UploadOptions = {}) => {
  const { maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'] } = options
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`)
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    throw new Error(`File size should be less than ${maxSizeMB}MB`)
  }

  return true
}

export const uploadImage = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized')
  }

  return new Promise((resolve, reject) => {
    try {
      const storageRef = ref(storage, path)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          if (onProgress) {
            onProgress(progress)
          }
        },
        (error) => {
          console.error('Upload error:', error)
          reject(error)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            resolve(downloadURL)
          } catch (error) {
            console.error('Error getting download URL:', error)
            reject(error)
          }
        }
      )
    } catch (error) {
      console.error('Upload setup error:', error)
      reject(error)
    }
  })
}