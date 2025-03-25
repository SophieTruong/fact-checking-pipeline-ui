export const API_CONFIG = {
  baseUrl: 'https://craicis-dime.cs.aalto.fi',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PRIVATE_API_KEY || '',
    'accept': 'application/json'
  }
}; 