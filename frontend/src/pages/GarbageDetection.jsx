import { useEffect, useRef, useState } from 'react'
import ImageUploader from '../components/ImageUploader'
import ImagePreview from '../components/ImagePreview'
import DetectionResults from '../components/DetectionResults'
import { detectGarbage } from '../services/api'

function GarbageDetection() {
  const [image, setImage] = useState(null)
  const [status, setStatus] = useState('initial')
  const [detections, setDetections] = useState([])
  const requestIdRef = useRef(0)

  const isDetecting = status === 'detecting'

  useEffect(() => {
    return () => {
      if (image?.url) {
        URL.revokeObjectURL(image.url)
      }
    }
  }, [image])

  const clearSelection = () => {
    requestIdRef.current += 1
    setImage(null)
    setDetections([])
    setStatus('initial')
  }

  const handleImageSelected = (file) => {
    console.log('IMAGE SELECTED:', file)

    requestIdRef.current += 1
    setImage({
      file,
      url: URL.createObjectURL(file),
    })
    setDetections([])
    setStatus('image-selected')
  }

  const handleDetect = async () => {
    console.log('DETECT BUTTON CLICKED')
    console.log('CURRENT IMAGE:', image)

    if (!image) {
      console.error('No image selected')
      return
    }

    if (isDetecting) {
      console.log('Detection already in progress')
      return
    }

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    setStatus('detecting')
    setDetections([])

    try {
      console.log('Sending image to backend...')
      console.log('Image file:', image.file)
      console.log('File name:', image.file?.name)
      console.log('File type:', image.file?.type)
      console.log('File size:', image.file?.size)

      const response = await detectGarbage(image.file)

      console.log('BACKEND RESPONSE:', response)

      if (requestId !== requestIdRef.current) {
        console.log('Request is outdated, ignoring response')
        return
      }

      const receivedDetections = Array.isArray(response?.detections)
        ? response.detections
        : []

      console.log('DETECTIONS:', receivedDetections)

      setDetections(receivedDetections)

      setStatus(
        receivedDetections.length
          ? 'success'
          : 'no-detections'
      )
    } catch (error) {
      console.error('DETECTION ERROR:', error)

      if (requestId === requestIdRef.current) {
        setStatus('error')
      }
    }
  }

  return (
    <main className="detection-page">
      <section className="page-intro">
        <p className="eyebrow">CivicBridge tools</p>

        <h1>Garbage detection</h1>

        <p>
          Upload a photo to identify visible waste and support
          cleaner, healthier public spaces.
        </p>
      </section>

      <div className="detection-layout">
        <div className="workflow-card">
          <ImageUploader
            onImageSelected={handleImageSelected}
            onValidationFailure={clearSelection}
            disabled={isDetecting}
          />

          <ImagePreview
            image={image}
            onReset={clearSelection}
            disabled={isDetecting}
          />

          <div className="detection-actions">
            <button
              className="button button-primary"
              type="button"
              onClick={handleDetect}
              disabled={!image || isDetecting}
            >
              {isDetecting ? (
                <>
                  <span
                    className="button-spinner"
                    aria-hidden="true"
                  />
                  Detecting garbage
                </>
              ) : (
                'Detect garbage'
              )}
            </button>

            {image && (
              <button
                className="button button-quiet"
                type="button"
                onClick={clearSelection}
                disabled={isDetecting}
              >
                Upload another image
              </button>
            )}
          </div>
        </div>

        <DetectionResults
          status={status}
          detections={detections}
        />
      </div>
    </main>
  )
}

export default GarbageDetection