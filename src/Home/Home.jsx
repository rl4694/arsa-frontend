import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import MapMarker from '../components/Marker/MapMarker'
import api from "../api"
import "leaflet/dist/leaflet.css"
import "./Home.css"

function Home() {
    const [disasters, setDisasters] = useState([])
    const [selectedDisaster, setSelectedDisaster] = useState(null)
    const [selectedTypes, setSelectedTypes] = useState({
        earthquake: true,
        landslide: true,
        tsunami: true,
        hurricane: true,
    })
    const [filtersOpen, setFiltersOpen] = useState(true)

    const dateMin = new Date("2000-01-01T00:00:00")
    const dateMax = new Date()
    const [dateStart, setDateStart] = useState(dateMin)
    const [dateEnd, setDateEnd] = useState(dateMax)

    const color_code = {
        "earthquake": "red",
        "tsunami": "blue",
        "landslide": "purple",
        "hurricane": "orange",
    }
    useEffect(() => {
        api.get("/natural_disasters")
            .then(res => {
                const records = res?.data?.records
                if (!records) {
                    setDisasters([])
                    return
                }
                setDisasters(Array.isArray(records) ? records : Object.values(records))
            })
            .catch(() => setDisasters([]))
    }, [])

    const toggleType = (type) => {
        setSelectedTypes(prev => ({ ...prev, [type]: !prev[type] }))
    }

    const filteredDisasters = useMemo(() => {
        return disasters.filter((disaster) => {
            if (!selectedTypes[disaster.type]) {
                return false
            }
            const disasterDate = new Date(disaster.date)
            if (!disasterDate || disasterDate.getTime() < dateStart || disasterDate.getTime() > dateEnd) {
                return false
            }

            return true
        })
    }, [disasters, selectedTypes, dateStart, dateEnd])

    // useEffect(() => {
    //     if (!selectedDisaster) {
    //         return
    //     }
    //     const stillVisible = filteredDisasters.some(
    //         (disaster) => disaster._id === selectedDisaster._id
    //     )
    //     if (!stillVisible) {
    //         setSelectedDisaster(null)
    //     }
    // }, [filteredDisasters, selectedDisaster])

    const renderMarkers = () => {
        return filteredDisasters.flatMap(disaster => {
            if (isNaN(disaster.latitude) || isNaN(disaster.longitude)) return []
            return [-360, 0, 360].map(offset => (
                <MapMarker
                    position={[disaster.latitude, disaster.longitude + offset]}
                    color={color_code[disaster.type]}
                    key={`${disaster._id}_${offset}`}
                    eventHandlers={{ click: () => setSelectedDisaster(disaster) }}
                />
            ))
        })
    }

    return (
        <div className="page">
            <h1 className="map-title">World Map</h1>
            <div className="map-filters">
                <div className="filters-header">
                    <h2>Filters</h2>
                    <button className="filters-toggle" onClick={() => setFiltersOpen(o => !o)}>
                        {filtersOpen ? '▲' : '▼'}
                    </button>
                </div>
                {filtersOpen && (
                    <>
                        <p className="filter-summary">
                            Showing {filteredDisasters.length} of {disasters.length}
                        </p>

                        <label className="filter-label">Type</label>
                        <div className="type-checkboxes">
                            {["earthquake", "landslide", "tsunami", "hurricane"].map(type => (
                                <label key={type} className="type-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={selectedTypes[type]}
                                        onChange={() => toggleType(type)}
                                    />
                                    <span className={`type-dot type-dot-${type}`}></span>
                                    {type}
                                </label>
                            ))}
                        </div>

                        <label htmlFor="date-start-slider">
                            Start: <strong>{dateStart.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}</strong>
                        </label>
                        <input
                            id="date-start-slider"
                            type="range"
                            min={dateMin.getTime()}
                            max={dateMax.getTime()}
                            step={(dateMax.getTime() - dateMin.getTime()) / 100}
                            value={dateStart.getTime()}
                            onChange={(e) => {
                                if (!isNaN(e.target.value)) {
                                    setDateStart(new Date(parseInt(e.target.value)))
                                }
                            }}
                        />

                        <label htmlFor="date-end-slider">
                            End: <strong>{dateEnd.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}</strong>
                        </label>
                        <input
                            id="date-end-slider"
                            type="range"
                            min={dateMin.getTime()}
                            max={dateMax.getTime()}
                            step={(dateMax.getTime() - dateMin.getTime()) / 100}
                            value={dateEnd.getTime()}
                            onChange={(e) => {
                                if (!isNaN(e.target.value)) {
                                    setDateEnd(new Date(parseInt(e.target.value)))
                                }
                            }}
                        />
                    </>
                )}
            </div>
            <MapContainer center={[30.0, 10.0]} zoom={3} scrollWheelZoom={true} worldCopyJump={true}>
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