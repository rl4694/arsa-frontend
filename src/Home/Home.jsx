import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import MapMarker from '../components/Marker/MapMarker'
import api from "../api"
import "leaflet/dist/leaflet.css"
import "./Home.css"

function Home() {
    const [disasters, setDisasters] = useState([])
    const [selectedDisaster, setSelectedDisaster] = useState(null)
    const [typeIndex, setTypeIndex] = useState(0)
    const [dateStartIndex, setDateStartIndex] = useState(0)
    const [dateEndIndex, setDateEndIndex] = useState(0)

    const color_code = {
        "earthquake": "red",
        "tsunami": "blue",
        "landslide": "purple",
        "hurricane": "orange",
    }
    const disasterTypes = ["all", "earthquake", "landslide", "tsunami", "hurricane"]

    useEffect(() => {
        api.get("/natural_disasters").then(res => {
            if (!res.data.records) {
                return
            }
            setDisasters(Object.values(res.data.records))
        })
    }, [])

    const availableDates = useMemo(() => {
        const validDates = disasters
            .map((disaster) => disaster.date)
            .filter((date) => typeof date === "string" && date.length > 0)
        return [...new Set(validDates)].sort()
    }, [disasters])

    useEffect(() => {
        if (availableDates.length === 0) {
            setDateStartIndex(0)
            setDateEndIndex(0)
            return
        }
        setDateStartIndex(0)
        setDateEndIndex(availableDates.length - 1)
    }, [availableDates.length])

    const selectedType = disasterTypes[typeIndex] ?? "all"

    const dateIndexByValue = useMemo(() => {
        const indexMap = {}
        availableDates.forEach((date, index) => {
            indexMap[date] = index
        })
        return indexMap
    }, [availableDates])

    const filteredDisasters = useMemo(() => {
        return disasters.filter((disaster) => {
            if (selectedType !== "all" && disaster.type !== selectedType) {
                return false
            }

            if (availableDates.length > 0) {
                const idx = dateIndexByValue[disaster.date]
                if (idx === undefined || idx < dateStartIndex || idx > dateEndIndex) {
                    return false
                }
            }

            return true
        })
    }, [disasters, selectedType, availableDates.length, dateIndexByValue, dateStartIndex, dateEndIndex])

    useEffect(() => {
        if (!selectedDisaster) {
            return
        }
        const stillVisible = filteredDisasters.some(
            (disaster) => disaster._id === selectedDisaster._id
        )
        if (!stillVisible) {
            setSelectedDisaster(null)
        }
    }, [filteredDisasters, selectedDisaster])

    const renderMarkers = () => {
        return filteredDisasters.flatMap(disaster => {
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
            <div className="map-filters">
                <h2>Filters</h2>
                <p className="filter-summary">
                    Showing {filteredDisasters.length} of {disasters.length}
                </p>

                <label htmlFor="type-slider">
                    Type: <strong>{selectedType}</strong>
                </label>
                <input
                    id="type-slider"
                    type="range"
                    min={0}
                    max={disasterTypes.length - 1}
                    step={1}
                    value={typeIndex}
                    onChange={(e) => setTypeIndex(Number(e.target.value))}
                />

                <label htmlFor="date-start-slider">
                    Start: <strong>{availableDates[dateStartIndex] ?? "N/A"}</strong>
                </label>
                <input
                    id="date-start-slider"
                    type="range"
                    min={0}
                    max={Math.max(availableDates.length - 1, 0)}
                    step={1}
                    value={dateStartIndex}
                    disabled={availableDates.length <= 1}
                    onChange={(e) => {
                        const nextStart = Number(e.target.value)
                        setDateStartIndex(nextStart)
                        if (nextStart > dateEndIndex) {
                            setDateEndIndex(nextStart)
                        }
                    }}
                />

                <label htmlFor="date-end-slider">
                    End: <strong>{availableDates[dateEndIndex] ?? "N/A"}</strong>
                </label>
                <input
                    id="date-end-slider"
                    type="range"
                    min={dateStartIndex}
                    max={Math.max(availableDates.length - 1, 0)}
                    step={1}
                    value={dateEndIndex}
                    disabled={availableDates.length <= 1}
                    onChange={(e) => setDateEndIndex(Number(e.target.value))}
                />
            </div>
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
