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

    const toInputDateValue = (d) => {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        return `${y}-${m}-${day}`
    }

    const parseInputDate = (s) => {
        if (!s || typeof s !== "string") return null
        const parts = s.split("-").map(Number)
        if (parts.length !== 3 || parts.some(Number.isNaN)) return null
        const [y, m, d] = parts
        return new Date(y, m - 1, d, 0, 0, 0, 0)
    }

    const clampDate = (d) => {
        const t = d.getTime()
        const minT = dateMin.getTime()
        const maxT = dateMax.getTime()
        if (t < minT) return new Date(minT)
        if (t > maxT) return new Date(maxT)
        return d
    }

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

                        <label className="filter-label" htmlFor="date-start-input">
                            Start date
                        </label>
                        <input
                            id="date-start-input"
                            className="filter-date-input"
                            type="date"
                            min={toInputDateValue(dateMin)}
                            max={toInputDateValue(dateMax)}
                            value={toInputDateValue(dateStart)}
                            onChange={(e) => {
                                const parsed = parseInputDate(e.target.value)
                                if (!parsed) return
                                const next = clampDate(parsed)
                                setDateStart(next)
                                if (next.getTime() > dateEnd.getTime()) {
                                    setDateEnd(next)
                                }
                            }}
                        />

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
                                    const next = clampDate(new Date(parseInt(e.target.value, 10)))
                                    setDateStart(next)
                                    if (next.getTime() > dateEnd.getTime()) {
                                        setDateEnd(next)
                                    }
                                }
                            }}
                        />

                        <label className="filter-label" htmlFor="date-end-input">
                            End date
                        </label>
                        <input
                            id="date-end-input"
                            className="filter-date-input"
                            type="date"
                            min={toInputDateValue(dateMin)}
                            max={toInputDateValue(dateMax)}
                            value={toInputDateValue(dateEnd)}
                            onChange={(e) => {
                                const parsed = parseInputDate(e.target.value)
                                if (!parsed) return
                                const next = clampDate(parsed)
                                setDateEnd(next)
                                if (next.getTime() < dateStart.getTime()) {
                                    setDateStart(next)
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
                                    const next = clampDate(new Date(parseInt(e.target.value, 10)))
                                    setDateEnd(next)
                                    if (next.getTime() < dateStart.getTime()) {
                                        setDateStart(next)
                                    }
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