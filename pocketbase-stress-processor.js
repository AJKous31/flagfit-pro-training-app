// PocketBase specific processor functions
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

export function validateAuthResponse(requestParams, response, context, ee, next) {
  if (response.statusCode === 200) {
    try {
      const body = JSON.parse(response.body)
      if (body.token) {
        context.vars.authToken = body.token
        console.log('Authentication successful')
      }
    } catch (e) {
      console.error('Failed to parse auth response:', e.message)
    }
  } else {
    console.log(`Auth failed with status: ${response.statusCode}`)
  }
  
  return next()
}

export function logPocketBaseResponse(requestParams, response, context, ee, next) {
  console.log(`PocketBase: ${requestParams.method} ${requestParams.url} - ${response.statusCode}`)
  return next()
}