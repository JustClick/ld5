import { storage } from '../config/firebase'
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage'

export async function verifyStorageSetup(): Promise<boolean> {
  const testRef = ref(storage, '_test/verify.txt')
  
  try {
    // Try to upload a small test file
    await uploadString(testRef, 'test')
    
    // Try to get the download URL
    await getDownloadURL(testRef)
    
    // Clean up the test file
    await deleteObject(testRef)
    
    console.log('✅ Firebase Storage is properly configured!')
    return true
  } catch (error) {
    console.error('❌ Firebase Storage configuration error:', error)
    return false
  }
}