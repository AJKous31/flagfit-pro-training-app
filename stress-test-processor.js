// Artillery processor for custom functions and validation
export function generateRandomEmail() {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `test${timestamp}${random}@example.com`
}

export function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function validateHealthResponse(requestParams, response, context, ee, next) {
  if (response.statusCode !== 200) {
    console.error(`Health check failed with status: ${response.statusCode}`)
  }
  
  try {
    const body = JSON.parse(response.body)
    if (body.status !== 'ok') {
      console.error('Health check returned non-OK status:', body.status)
    }
  } catch (e) {
    console.error('Failed to parse health check response:', e.message)
  }
  
  return next()
}

export function logResponse(requestParams, response, context, ee, next) {
  console.log(`${requestParams.method} ${requestParams.url} - ${response.statusCode}`)
  return next()
}