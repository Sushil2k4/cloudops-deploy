const API_BASE = '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = body.message || 'Something went wrong while calling the API.'
    throw new Error(message)
  }

  return body
}

export async function createDeployment(repoUrl) {
  return request('/deploy', {
    method: 'POST',
    body: JSON.stringify({ repoUrl }),
  })
}

export async function getDeploymentStatus(id) {
  return request(`/status/${id}`)
}
