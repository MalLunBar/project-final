import ReactDOMServer from "react-dom/server"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import L from "leaflet"
import { MapPin } from "lucide-react"

const SmallMap = ({ coordinates }) => {

  // Create a Leaflet divIcon with Lucide SVG
  const markerIcon = L.divIcon({
    html: ReactDOMServer.renderToString(<MapPin size={32} strokeWidth={1.5} fill='#fca742' />),
    className: "", // Remove default Leaflet styles
    iconSize: [32, 32],
    iconAnchor: [16, 16], // Adjust so the "point" is at the right place
  })

  return (
    <MapContainer
      center={coordinates}
      zoom={17}
      className='h-[200px] w-full rounded-xl'>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        position={coordinates}
        icon={markerIcon}
        title='Loppis location'
      />
    </MapContainer>
  )
}

export default SmallMap