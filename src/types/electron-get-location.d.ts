declare module 'electron-get-location' {
  interface Location {
    city: string
    country: string
    latitude: string
    longitude: string
    timezone: string
  }
  export default function(): Promise<Location>
}
