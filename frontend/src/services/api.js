const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

export async function detectGarbage(file) {
  if (!file) {
    throw new Error('Please select an image before starting detection.')
  }

  if (!apiUrl) {
    throw new Error('VITE_API_URL is not configured. Add it to your .env file and restart Vite.')
  }

  const formData = new FormData()
  formData.append('file', file)

  let response

  try {
    response = await fetch(`${apiUrl}/predict`, {
      method: 'POST',
      body: formData,
    })
  } catch (error) {
    throw new Error('Unable to reach the garbage detection service. Check that the backend is running and try again.', {
      cause: error,
    })
  }

  if (!response.ok) {
    let message = `Detection request failed with status ${response.status}.`

    try {
      const errorBody = await response.json()
      message = errorBody.detail || errorBody.message || message
    } catch {
      // The backend may return an empty or non-JSON error response.
    }

    throw new Error(message)
  }

  try {
    return await response.json()
  } catch (error) {
    throw new Error('The detection service returned an invalid response.', { cause: error })
  }
}