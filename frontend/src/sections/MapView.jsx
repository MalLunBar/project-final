import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon, marker } from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MapView = () => {
  const center = [59.3293, 18.0686] // Default center for Stockholm

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
        className='h-[500px] w-full'
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
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
      </MapContainer>
    </section>
  )
}

export default MapView