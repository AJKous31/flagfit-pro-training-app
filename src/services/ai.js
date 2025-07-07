export async function predictIntensity(payload) {
  const response = await fetch('http://localhost:8080/api/v1/predict/intensity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error('Failed to fetch intensity prediction');
  }
  return await response.json();
} 