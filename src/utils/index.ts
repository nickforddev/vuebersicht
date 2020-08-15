/* eslint-disable camelcase */

import { exec } from 'child_process'
import axios from 'axios'
import Place from '@/models/Place'

export function run(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else if (stderr) {
        reject(stderr)
      } else {
        resolve(stdout)
      }
    })
  })
}

export function sleep(duration: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, duration))
}

interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

export async function getPlace(lat: string | number, lng: string | number): Promise<Place> {
  const apiKey = process.env.GOOGLE_API_KEY
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
  )
  const addressComponents: AddressComponent[] = response?.data?.results?.[0]?.address_components
  const city = addressComponents.find(({ types }) => types.includes('locality'))
    ?.long_name as string
  const state = addressComponents.find(({ types }) => types.includes('administrative_area_level_1'))
    ?.short_name as string
  const country = addressComponents.find(({ types }) => types.includes('country'))
    ?.short_name as string
  return { city, state, country }
}
