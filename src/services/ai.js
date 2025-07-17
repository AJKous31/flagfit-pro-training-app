export async function predictIntensity(payload) {
  const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8080';
const response = await fetch(`${AI_SERVICE_URL}/api/v1/predict/intensity`, {
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