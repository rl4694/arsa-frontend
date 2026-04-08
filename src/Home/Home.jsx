import { useEffect, useMemo, useState } from 'react'
import { useDebounced } from '../hooks/useDebounced'
import { MapContainer, TileLayer } from 'react-leaflet'
import MapMarker from '../components/Marker/MapMarker'
import api from "../api"
import "leaflet/dist/leaflet.css"
import "./Home.css"
import MapFilter from '../components/MapFilter/MapFilter'

// Constants
const startPosition = [30.0, 10.0]
const affectedRadius = 0.1
const minMapZoom = 2
const maxMapZoom = 8
const colorCode = {
    earthquake: "red",
    tsunami: "blue",
    landslide: "purple",
    hurricane: "orange",
}
const initialSelectedTypes = {
    earthquake: true,
    landslide: true,
    tsunami: true,
    hurricane: true,
}

function Home() {
    // Main state
    const dateMin = new Date("2000-01-01T00:00:00")
    const dateMax = new Date()
    const [disasters, setDisasters] = useState([])
    const [cities, setCities] = useState([])
    const [selectedDisaster, setSelectedDisaster] = useState(null)
    const [selectedCities, setSelectedCities] = useState([])
    const [selectedTypes, setSelectedTypes] = useState(initialSelectedTypes)
    const [dateStart, setDateStart] = useState(dateMin)
    const [dateEnd, setDateEnd] = useState(dateMax)

    // Derived state
    const dateStartDebounced = useDebounced(dateStart, 200)
    const dateEndDebounced = useDebounced(dateEnd, 200)
    const filteredDisasters = useMemo(() => {
        return disasters.filter((disaster) => {
            const disasterDate = new Date(disaster.date)
            return (
                selectedTypes[disaster.type] &&
                disasterDate &&
                disasterDate.getTime() >= dateStartDebounced &&
                disasterDate.getTime() <= dateEndDebounced
            )
        })
    }, [disasters, selectedTypes, dateStartDebounced, dateEndDebounced])

    // Lifecycle functions
    useEffect(() => {
        api.get("/natural_disasters")
            .then(res => {
                const records = res?.data?.records
                const data = records ? Object.values(records) : []
                setDisasters(data)
            })
            .catch(() => setDisasters([]))
        api.get("/cities")
            .then(res => {
                const records = res?.data?.records
                const data = records ? Object.values(records) : []
                setCities(data)
            })
            .catch(() => setCities([]))
    }, [])

    const selectDisaster = (disaster) => {
        setSelectedDisaster(disaster)
        const nearbyCities = cities.filter(city => {
            return (
                Math.abs(city.latitude - disaster.latitude) < affectedRadius &&
                Math.abs(city.longitude - disaster.longitude) < affectedRadius
            )
        })
        setSelectedCities(nearbyCities)
    }

    // Render functions
    const renderMarkers = () => {
        return filteredDisasters.flatMap(disaster => {
            if (isNaN(disaster.latitude) || isNaN(disaster.longitude)) {
                return []
            }
            return [-360, 0, 360].map(offset => (
                <MapMarker
                    position={[disaster.latitude, disaster.longitude + offset]}
                    color={colorCode[disaster.type]}
                    key={`${disaster._id}_${offset}`}
                    eventHandlers={{ click: () => selectDisaster(disaster) }}
                />
            ))
        })
    }

    const renderAffectedCities = () => {
        if (selectedCities.length <= 0) {
            return
        }
        return (
            <p className="panel-cities">
                Affected Cities: {selectedCities.map((city, index) => (
                    <span key={city._id}>
                        {city.name}
                        {index < selectedCities.length - 1 && ", "}
                    </span>
                ))}
            </p>
        )
    }

    return (
        <div className="page">
            <h1 className="map-title">World Map</h1>
            <MapFilter
                description={`Showing ${filteredDisasters.length} of ${disasters.length}`}
                selectedTypes={selectedTypes}
                dateStart={dateStart}
                dateEnd={dateEnd}
                dateMin={dateMin}
                dateMax={dateMax}
                setSelectedTypes={setSelectedTypes}
                setDateStart={setDateStart}
                setDateEnd={setDateEnd}
            />
            <MapContainer center={startPosition} zoom={3} minZoom={minMapZoom} maxZoom={maxMapZoom} scrollWheelZoom={true} worldCopyJump={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    minZoom={minMapZoom}
                    maxZoom={maxMapZoom}
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {renderMarkers()}
            </MapContainer>
            {selectedDisaster && (
                <div className="disaster-panel">
                    <button className="panel-close" onClick={() => selectDisaster(null)}>×</button>
                    <span className="panel-type">{selectedDisaster.type}</span>
                    <h2 className="panel-name">{selectedDisaster.name}</h2>
                    {renderAffectedCities()}
                    <p className="panel-date">{selectedDisaster.date}</p>
                    <p className="panel-description">
                        {selectedDisaster.description}
                    </p>
                </div>
            )}
        </div>
    )
}

export default Home