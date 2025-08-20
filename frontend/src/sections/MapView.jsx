import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, Circle, CircleMarker, Tooltip } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { useEffect } from 'react'
import LoppisCard from '../components/LoppisCard'
import L from "leaflet"
import { MapPin } from "lucide-react"
import ReactDOMServer from "react-dom/server"
import 'leaflet/dist/leaflet.css'
import useGeoStore from '../stores/useGeoStore'

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
const PopupCard = ({ loppis, likedLoppis, setLikedLoppis }) => {
  const map = useMap()
  return (
    <LoppisCard
      loppis={loppis}
      likedLoppis={likedLoppis}
      setLikedLoppis={setLikedLoppis}
      variant='map'
      onClose={() => map.closePopup()}
    />
  )
}

const MapView = ({
  loppisList,
  likedLoppis,
  setLikedLoppis,
  center = [59.3293, 18.0686],
  zoom = 11
}) => {

  // Create a Leaflet divIcon with Lucide SVG
  const markerIcon = L.divIcon({
    html: ReactDOMServer.renderToString(<MapPin size={32} fill='#FF8242' />),
    className: "", // Remove default Leaflet styles
    iconSize: [32, 32],
    iconAnchor: [16, 16], // Adjust so the "point" is at the right place
  })

  return (
    <section className='h-full relative'>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false} // stänger av default (som ligger uppe vänster)
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
            >
              <Popup
                className="my-popup"
                closeButton={false}>
                <PopupCard loppis={loppis} likedLoppis={likedLoppis}
                  setLikedLoppis={setLikedLoppis} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </section>
  )
}

export default MapView