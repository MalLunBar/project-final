import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware' //låter dig prenumerera på delar av state (selectors) utan att re‑rendera i onödan. Ger lite extra features runt selektiv subcribing (bra för prestanda).

const DEFAULT_OPTS = {
  enableHighAccuracy: true, //be enheten ge så exakt position som möjligt (påverkar batteri).
  timeout: 8000,
  maximumAge: 0, //acceptera inte cachen; hämta färsk position.
}

const useGeoStore = create()(
  subscribeWithSelector((set, get) => ({
    // state
    location: null,        // { lat, lng, accuracy?, timestamp? }
    status: 'idle',        // 'idle' | 'requesting' | 'granted' | 'denied' | 'error' | 'watching'
    error: null,
    supportsGeolocation: typeof window !== 'undefined' && 'geolocation' in navigator, //nabb feature‑detekt – vissa desktop/webview:ar har inte geolokalisering.
    watchId: null, //id från watchPosition så vi kan stoppa senare.

    /*Först: om funktionaliteten saknas – sätt fel och ge upp. Sätt status till 'requesting' för spinners/feedback. Mixa samman options (default + ev. egna). Permissions API (om det finns): vi kollar om läget redan är 'denied' så UI direkt kan visa rätt copy. (Det här stoppar inte själva geolokaliseringen; det är bara en hint för UI.) */
    async requestLocation(opts) {
      if (!get().supportsGeolocation) {
        set({ status: 'error', error: 'Din webbläsare stödjer inte geolokalisering.' })
        return
      }

      set({ status: 'requesting', error: null })
      const options = { ...DEFAULT_OPTS, ...(opts || {}) }

      try {
        if (navigator.permissions?.query) {
          const p = await navigator.permissions.query({ name: 'geolocation' })
          if (p.state === 'denied') set({ status: 'denied' })
        }
      } catch { }

      /*Vi wrappar getCurrentPosition i en Promise så du kan await requestLocation() i UI om du vill. Success: vi plockar ut latitude, longitude, optional accuracy + timestamp, uppdaterar state och sätter status: 'granted'.Error: om felet är PERMISSION_DENIED → status: 'denied' (annars 'error'), samt ett meddelande. Vi anropar alltid resolve() så await inte hänger.*/
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude, accuracy } = pos.coords
            set({
              location: { lat: latitude, lng: longitude, accuracy, timestamp: pos.timestamp },
              status: 'granted',
              error: null,
            })
            resolve()
          },
          (err) => {
            const denied = err.code === err.PERMISSION_DENIED
            set({
              status: denied ? 'denied' : 'error',
              error: err.message || (denied ? 'Åtkomst nekad.' : 'Kunde inte hämta platsen.'),
            })
            resolve()
          },
          options
        )
      })
    },
    
    /*Startar realtidsuppdatering av positionen. Om redan igång (har watchId) → gör inget. Vid varje positionsuppdatering sätter vi: location till den nya platsen, status till 'watching' (så UI kan visa “följer dig…” t.ex.). Vid fel → samma hantering som ovan. Vi sparar watchId så vi kan stoppa senare. */
    async startWatching(opts) {
      if (!get().supportsGeolocation) {
        set({ status: 'error', error: 'Din webbläsare stödjer inte geolokalisering.' })
        return
      }
      if (get().watchId !== null) return // redan igång

      set({ status: 'requesting', error: null })
      const options = { ...DEFAULT_OPTS, ...(opts || {}) }

      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords
          set({
            location: { lat: latitude, lng: longitude, accuracy, timestamp: pos.timestamp },
            status: 'watching',
            error: null,
          })
        },
        (err) => {
          const denied = err.code === err.PERMISSION_DENIED
          set({
            status: denied ? 'denied' : 'error',
            error: err.message || (denied ? 'Åtkomst nekad.' : 'Kunde inte hämta platsen.'),
          })
        },
        options
      )

      set({ watchId: id })
    },

    stopWatching() {
      const id = get().watchId
      if (id !== null) {
        navigator.geolocation.clearWatch(id)
        set({ watchId: null, status: get().location ? 'granted' : 'idle' })
      }
    },

    clearLocation() {
      set({ location: null, status: 'idle', error: null })
    },

    setLocation(loc) {
      set({ location: loc, status: loc ? 'granted' : 'idle' })
    },
  }))
)

/** Haversine avståndsberäkning i km */
export function distanceKm(a, b) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export default useGeoStore