import { useState, useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import MapMarker from '../components/Marker/MapMarker'
import api from "../api"
import "leaflet/dist/leaflet.css"
import "./Home.css"

function Home() {
    const [disasters, setDisasters] = useState([])
    const [selectedDisaster, setSelectedDisaster] = useState(null)
    const color_code = {
        "earthquake": "red",
        "tsunami": "blue",
        "landslide": "purple",
        "hurricane": "orange",
    }

    useEffect(() => {
        api.get("/natural_disasters").then(res => {
            if (!res.data.records) {
                return
            }
            setDisasters(Object.values(res.data.records))
        })
    }, [])

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
                    eventHandlers={{ click: () => setSelectedDisaster(disaster) }}
                />
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
            {selectedDisaster && (
                <div className="disaster-panel">
                    <button className="panel-close" onClick={() => setSelectedDisaster(null)}>×</button>
                    <span className="panel-type">{selectedDisaster.type}</span>
                    <h2 className="panel-name">{selectedDisaster.name}</h2>
                    <p className="panel-date">{selectedDisaster.date}</p>
                    <p className="panel-description">{selectedDisaster.description}</p>
                </div>
            )}
        </div>
    )
}

export default Home
