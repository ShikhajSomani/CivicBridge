import { useRef, useState } from 'react'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024

function ImageUploader({ onImageSelected, onValidationFailure, disabled = false }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')

  const openFilePicker = () => {
    if (!disabled) inputRef.current?.click()
  }

  const showValidationError = (message) => {
    setError(message)
    onValidationFailure?.()
    if (inputRef.current) inputRef.current.value = ''
  }

  const processFile = (file) => {
    setError('')

    if (!file) {
      showValidationError('Please select an image to upload.')
      return
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showValidationError('Please upload a JPG, PNG, or WEBP image.')
      return
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      showValidationError('Image size is too large. Please choose a smaller image.')
      return
    }

    onImageSelected(file)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openFilePicker()
    }
  }

  return (
    <section className="uploader-section" aria-labelledby="upload-title">
      <div className="section-heading"><span className="step-number">1</span><div><h2 id="upload-title">Add a photo</h2><p id="upload-guidance">Upload a clear photo of the area you want to assess.</p></div></div>
      <div className={`drop-zone ${isDragging ? 'is-dragging' : ''} ${disabled ? 'is-disabled' : ''}`} role="button" tabIndex={disabled ? -1 : 0} aria-disabled={disabled} aria-describedby={`upload-guidance${error ? ' upload-error' : ''}`} onClick={openFilePicker} onKeyDown={handleKeyDown} onDragEnter={(event) => { event.preventDefault(); if (!disabled) setIsDragging(true) }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false) }} onDrop={(event) => { event.preventDefault(); setIsDragging(false); if (!disabled) processFile(event.dataTransfer.files[0]) }}>
        <input ref={inputRef} id="image-upload" className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload a JPG, PNG, or WEBP image" disabled={disabled} onChange={(event) => processFile(event.target.files[0])} />
        <span className="upload-icon" aria-hidden="true">↑</span>
        <h3>{disabled ? 'Detection in progress' : 'Drop an image here'}</h3>
        <p>{disabled ? 'Please wait while we analyse your image.' : 'or select a file from your device'}</p>
        <button type="button" className="button button-secondary upload-button" tabIndex={-1} onClick={(event) => { event.stopPropagation(); openFilePicker() }} disabled={disabled}>Choose image</button>
        <span className="upload-formats">JPG, PNG, or WEBP · Maximum 10 MB</span>
      </div>
      {error && <p id="upload-error" className="form-error" role="alert">{error}</p>}
    </section>
  )
}

export default ImageUploader