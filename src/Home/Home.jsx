import { MapContainer, TileLayer } from 'react-leaflet'
import MapMarker from '../Marker/MapMarker'
import "leaflet/dist/leaflet.css"
import "./Home.css"

import { useEffect, useState } from 'react'
import api from '../api'

function Home() {
    const [disasters, setDisasters] = useState([])
    const color_code = {
        "earthquake": "red",
        "tsunami": "blue",
        "landslide": "purple",
    }

    useEffect(() => {
        api.get("/natural_disasters").then(res => setDisasters(Object.values(res.data.disasters)))
    }, [])

    const renderMarkers = () => {
        return disasters.map(disaster => {
            // Get the latitude and longitude from coordinates
            const [ latitude, longitude ] = disaster.location.split(", ").map(parseFloat)

            return (
                <MapMarker 
                    position={[latitude, longitude]} 
                    color={color_code[disaster.type]}
                    key={disaster.location}
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
