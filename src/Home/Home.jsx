import { Link } from "react-router-dom"
import { MapContainer, TileLayer } from 'react-leaflet'
import MapMarker, { MarkerColors } from '../Marker/MapMarker'
import "leaflet/dist/leaflet.css"
import "./Home.css"

function Home() {
    return (
        <div className="page">
            <MapContainer center={[30.0, 10.0]} zoom={3} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Example markers with different colors and sizes */}
                <MapMarker 
                    position={[40.7, -74.0]} 
                    color={MarkerColors.red}
                    size="large"
                >
                    <strong>New York City</strong>
                    <br />
                    The Big Apple 🗽
                </MapMarker>
                
                <MapMarker 
                    position={[51.5, -0.1]} 
                    color={MarkerColors.blue}
                >
                    <strong>London</strong>
                    <br />
                    Capital of England
                </MapMarker>
                
                <MapMarker 
                    position={[48.8, 2.3]} 
                    color={MarkerColors.purple}
                >
                    <strong>Paris</strong>
                    <br />
                    City of Light
                </MapMarker>
                
                <MapMarker 
                    position={[35.7, 139.7]} 
                    color={MarkerColors.green}
                    size="small"
                >
                    <strong>Tokyo</strong>
                    <br />
                    Capital of Japan
                </MapMarker>
            </MapContainer>
        </div>
    )
}

export default Home