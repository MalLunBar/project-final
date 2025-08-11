import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const MapView = () => {
  const center = [59.3293, 18.0686] // Default center for Stockholm

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
      </MapContainer>
    </section>
  )
}

export default MapView