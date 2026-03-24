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

    const allDates = useMemo(() => {
        const dates = []
        const start = new Date("2000-01-01T00:00:00")
        const end = new Date()
        const current = new Date(start)

        while (current <= end) {
            const year = current.getFullYear()
            const month = String(current.getMonth() + 1).padStart(2, "0")
            const day = String(current.getDate()).padStart(2, "0")
            dates.push(`${year}-${month}-${day}`)
            current.setDate(current.getDate() + 1)
        }

        return dates
    }, [])

    const [dateStartIndex, setDateStartIndex] = useState(0)
    const [dateEndIndex, setDateEndIndex] = useState(allDates.length - 1)

    const color_code = {
        "earthquake": "red",
        "tsunami": "blue",
        "landslide": "purple",
        "hurricane": "orange",
    }
    const disasterTypes = ["all", "earthquake", "landslide", "tsunami", "hurricane"]

    const selectedType = disasterTypes[typeIndex] ?? "all"
    const startDate = allDates[dateStartIndex] ?? "2000-01-01"
    const endDate = allDates[dateEndIndex] ?? allDates[allDates.length - 1]

    useEffect(() => {
        api.get("/natural_disasters")
        // api.get("/natural_disasters", {
        //     params: {
        //         start_date: startDate,
        //         end_date: endDate
        //     }
        // })
        .then(res => {
            const records = res?.data?.records

            if (!records) {
                setDisasters([])
                return
            }

            setDisasters(Array.isArray(records) ? records : Object.values(records))
        }).catch(() => {
            setDisasters([])
        })
    }, [])

    const filteredDisasters = useMemo(() => {
        return disasters.filter((disaster) => {
            if (selectedType !== "all" && disaster.type !== selectedType) {
                return false
            }

            if (!disaster.date || disaster.date < startDate || disaster.date > endDate) {
                return false
            }

            return true
        })
    }, [disasters, selectedType, startDate, endDate])

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
                    Start: <strong>{startDate}</strong>
                </label>
                <input
                    id="date-start-slider"
                    type="range"
                    min={0}
                    max={Math.max(allDates.length - 1, 0)}
                    step={1}
                    value={dateStartIndex}
                    disabled={allDates.length <= 1}
                    onChange={(e) => {
                        const nextStart = Number(e.target.value)
                        setDateStartIndex(nextStart)
                        if (nextStart > dateEndIndex) {
                            setDateEndIndex(nextStart)
                        }
                    }}
                />

                <label htmlFor="date-end-slider">
                    End: <strong>{endDate}</strong>
                </label>
                <input
                    id="date-end-slider"
                    type="range"
                    min={dateStartIndex}
                    max={Math.max(allDates.length - 1, 0)}
                    step={1}
                    value={dateEndIndex}
                    disabled={allDates.length <= 1}
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