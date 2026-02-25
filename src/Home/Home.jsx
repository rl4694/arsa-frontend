import { MapContainer, TileLayer } from 'react-leaflet'
import MapMarker from '../components/Marker/MapMarker'
import "leaflet/dist/leaflet.css"
import "./Home.css"
import useRecord from '../hooks/useRecord'

function Home() {
    const [disasters] = useRecord("/natural_disasters")
    const color_code = {
        "earthquake": "red",
        "tsunami": "blue",
        "landslide": "purple",
    }

    const renderMarkers = () => {
        return disasters.flatMap(disaster => {
            const lat = disaster.latitude ?? parseFloat(disaster.location?.split(',')[0])
            const lon = disaster.longitude ?? parseFloat(disaster.location?.split(',')[1])
            if (isNaN(lat) || isNaN(lon)) return []
            return (
                <MapMarker
                    position={[lat, lon]}
                    color={color_code[disaster.type]}
                    key={disaster._id}
                >
                    <strong>{disaster.name}</strong>
                    <br />
                    {disaster.date}
                    <br />
                    {disaster.description}
                </MapMarker>
            )
        })
    }

    return (
        <div className="page">
            <h1 className="map-title">World Map</h1>
            <MapContainer center={[30.0, 10.0]} zoom={3} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {renderMarkers()}
            </MapContainer>
        </div>
    )
}

export default Home
