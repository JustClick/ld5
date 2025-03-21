import { useLogoUpload } from './useLogoUpload'

export default function LogoUpload() {
  const { uploadingLogo, fileInputRef, handleLogoChange, canUpload } = useLogoUpload()

  const handleLogoClick = () => {
    if (!uploadingLogo && canUpload) {
      fileInputRef.current?.click()
    }
  }

  if (!canUpload) {
    return null
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">App Logo</h3>
          <p className="mt-1 text-sm text-gray-500">
            Update the application logo. Recommended size: 200x200px (PNG or JPEG)
          </p>
        </div>
        <div 
          className="relative group cursor-pointer" 
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleLogoClick()
            }
          }}
        >
          <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-indigo-500 transition-colors">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-gray-400 group-hover:text-indigo-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            {uploadingLogo && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png"
            onChange={handleLogoChange}
          />
        </div>
      </div>
    </div>
  )
}