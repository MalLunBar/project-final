import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { useEffect } from 'react'
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

const MapView = ({ center = [59.3293, 18.0686], zoom = 11 }) => {


  // You can replace this with dynamic data if needed
  const markers = [
    { position: [59.3293, 18.0686], title: 'Loppis 1' },
    { position: [59.3326, 18.0649], title: 'Loppis 2' },
    { position: [59.3269, 18.0710], title: 'Loppis 3' },
  ]

  return (
    <section>
      <h2>Map View</h2>
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
          {markers.map(marker => (
            <Marker
              key={marker.title}
              position={marker.position}
              title={marker.title}
            >
              <Popup>
                <h3>{marker.title}</h3>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </section>
  )
}

export default MapView