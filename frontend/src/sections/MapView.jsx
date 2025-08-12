import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { useEffect } from 'react'
import LoppisCard from '../components/LoppisCard'
import L, { marker } from "leaflet"
import { MapPin } from "lucide-react"
import ReactDOMServer from "react-dom/server"
import 'leaflet/dist/leaflet.css'

const FlyTo = ({ center, zoom = 11 }) => {
  const map = useMap()
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.flyTo(center, zoom, { duration: 1.0 })
    }
  }, [center, zoom, map])
  return null
}

const MapView = ({ loppisList, center = [59.3293, 18.0686], zoom = 11 }) => {

  // Create a Leaflet divIcon with Lucide SVG
  const markerIcon = L.divIcon({
    html: ReactDOMServer.renderToString(<MapPin size={32} fill='#FF8242' />),
    className: "", // Remove default Leaflet styles
    iconSize: [32, 32],
    iconAnchor: [16, 16], // Adjust so the "point" is at the right place
  })

  return (
    <section>
      <MapContainer
        center={center}
        zoom={11}
        className='h-[400px] w-full'
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Imperatively move the map when `center` changes */}
        <FlyTo center={center} zoom={zoom} />
        <MarkerClusterGroup>
          {loppisList.map(loppis => (
            <Marker
              key={loppis._id}
              position={[loppis.location.coordinates.coordinates[1], loppis.location.coordinates.coordinates[0]]}
              icon={markerIcon}
              title={loppis.title}
            >
              <Popup>
                <LoppisCard loppis={loppis} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </section>
  )
}

export default MapView