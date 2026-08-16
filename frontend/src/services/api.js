const apiUrl = 'http://127.0.0.1:8000'

console.log('API URL:', apiUrl)

export async function detectGarbage(file) {
  console.log('detectGarbage() called')
  console.log('Sending request to:', `${apiUrl}/predict`)

  if (!file) {
    throw new Error('Please select an image before starting detection.')
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(`${apiUrl}/predict`, {
      method: 'POST',
      body: formData,
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      let message = `Detection request failed with status ${response.status}.`

      try {
        const errorBody = await response.json()
        message = errorBody.detail || errorBody.message || message
      } catch {
        // Backend may return a non-JSON response.
      }

      throw new Error(message)
    }

    const data = await response.json()

    console.log('Backend response:', data)

    return data
  } catch (error) {
    console.error('API REQUEST ERROR:', error)
    throw error
  }
}