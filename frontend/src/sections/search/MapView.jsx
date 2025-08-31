import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, Circle, CircleMarker, Tooltip } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'

import LoppisCard from '../../components/LoppisCard'
import { useEffect, useState } from 'react'

import L from "leaflet"
import { MapPin, LoaderCircle } from "lucide-react"
import ReactDOMServer from "react-dom/server"
import 'leaflet/dist/leaflet.css'
import useGeoStore from '../../stores/useGeoStore'

const createCustomClusterIcon = (cluster) => {
  const count = cluster.getChildCount()

  return L.divIcon({
    html: `
      <span class="inline-flex items-center justify-center
                   w-9 h-9 rounded-full bg-teal-950 text-white
                   text-[11px] font-semibold ring-2 ring-white shadow">
        ${count}
      </span>
    `,
    // Ta bort default bakgrund/border från Leaflets divIcon
    className: "bg-transparent border-0",
    // Viktigt: detta styr den YTTRE ikonytan (klickyta/placering)
    iconSize: [36, 36],
    // Ankra i mitten så den “sitter” på markörens punkt
    iconAnchor: [18, 18],
  })
}

const FlyTo = ({ center, zoom = 11 }) => {
  const map = useMap()
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.flyTo(center, zoom, { duration: 1.0 })
    }
  }, [center, zoom, map])
  return null
}

function UserLocationLayer() {
  const loc = useGeoStore(s => s.location)
  if (!loc) return null

  const { lat, lng, accuracy } = loc
  const acc = Number.isFinite(accuracy) ? Math.max(accuracy, 25) : 50

  return (
    <>
      {/* Accuracy-cirkel */}
      <Circle
        center={[lat, lng]}
        radius={acc}
        pathOptions={{ color: '#60A5FA', weight: 1, opacity: 0.8, fillOpacity: 0.15 }}
      />
      {/* Blå prick */}
      <CircleMarker
        center={[lat, lng]}
        radius={6}
        pathOptions={{ color: '#1D4ED8', weight: 2, fillOpacity: 1 }}
      >
        <Tooltip direction="top" offset={[0, -6]} opacity={0.9}>
          Du är här
        </Tooltip>
      </CircleMarker>
    </>
  )
}

// Liten wrapper som kan stänga aktuell popup
const PopupCard = ({ loppis }) => {
  const map = useMap()
  return (
    <div role="dialog" aria-label="Loppis details" aria-live="polite">
      <LoppisCard
        loppis={loppis}
        variant='map'
        onClose={() => map.closePopup()}
      />
    </div>
  )
}

const MapView = ({
  loppisList,
  center,
  zoom,
  loading
}) => {

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 600)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Create a Leaflet divIcon with Lucide SVG
  const markerIcon = L.divIcon({
    html: ReactDOMServer.renderToString(
      <MapPin size={32} strokeWidth={1.5} fill='#fca742' />
    ),
    className: "", // Remove default Leaflet styles
    iconSize: [32, 32],
    iconAnchor: [16, 16], // Adjust so the "point" is at the right place
  })

  return (
    <section className='h-full relative'>
      <h2 className="sr-only">Sökresultat kartvy</h2>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false} // stänger av default (som ligger uppe vänster)
        role="region"
        aria-label="Map showing loppis locations"
        keyboard={false} // disables Leaflet's default keyboard navigation
        className='my-map h-full w-full'
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Leaflets zoomkontroll – nere till vänster */}
        <ZoomControl
          position="bottomleft" />

        {/* Imperatively move the map when `center` changes */}
        <FlyTo center={center} zoom={zoom} />

        {/* User location layer */}
        <UserLocationLayer />

        {/* Custom cluster group with custom icon */}
        <MarkerClusterGroup
          chuckedLoading
          iconCreateFunction={createCustomClusterIcon}
        >


          {/* Loop through loppisList and create markers */}
          {loppisList.map(loppis => (
            <Marker
              key={loppis._id}
              position={[loppis.location.coordinates.coordinates[1], loppis.location.coordinates.coordinates[0]]}
              icon={markerIcon}
              title={loppis.title}
              tabIndex={0}
              aria-label={`${loppis.title} kartmarkör`}
              keyboard={true} // allows marker to be focused
            >
              <Popup
                className="my-popup"
                closeButton={false}
                autoPan
                keepInView
                autoPanPaddingTopLeft={
                  isMobile ? [40, 120] : [60, 170]
                }
                autoPanPaddingBottomRight={[16, 16]}
              >
                <PopupCard loppis={loppis} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      {loading && (
        <div className="absolute inset-0 z-1200 flex flex-col items-center justify-center gap-2 py-10 bg-white/70 backdrop-blur-[1px] pointer-events-none text-gray-600">
          <LoaderCircle className="animate-spin" size={30} />
          <p>Laddar loppisar...</p>
        </div>
      )}
    </section>
  )
}

export default MapView