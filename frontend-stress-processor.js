// Frontend stress test processor
export function simulateUserDelay() {
  // Simulate realistic user interaction delays
  const delays = [1, 2, 3, 5, 8]
  return delays[Math.floor(Math.random() * delays.length)]
}

export function validateReactApp(requestParams, response, context, ee, next) {
  if (response.statusCode === 200 && response.body.includes('React')) {
    console.log('React app loaded successfully')
  } else if (response.statusCode !== 200) {
    console.error(`Frontend load failed with status: ${response.statusCode}`)
  }
  
  return next()
}

export function checkAssetLoading(requestParams, response, context, ee, next) {
  const url = requestParams.url
  const isAsset = url.includes('.js') || url.includes('.css') || url.includes('.svg')
  
  if (isAsset && response.statusCode !== 200) {
    console.error(`Asset loading failed: ${url} - Status: ${response.statusCode}`)
  }
  
  return next()
}

export function logFrontendMetrics(requestParams, response, context, ee, next) {
  const responseTime = response.timings?.response || 0
  console.log(`Frontend: ${requestParams.url} - ${response.statusCode} (${responseTime}ms)`)
  
  if (responseTime > 2000) {
    console.warn(`Slow response detected: ${requestParams.url} took ${responseTime}ms`)
  }
  
  return next()
}