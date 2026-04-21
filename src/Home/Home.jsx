import { useMemo, useState, useEffect } from 'react'
import { useDebounced } from '../hooks/useDebounced'
import { useRecords } from '../hooks/useRecords'
import { MapContainer, TileLayer, Circle } from 'react-leaflet'
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
    // Use UTC-midnight timestamps to avoid timezone-dependent slider values.
    const now = new Date()
    const dateMax = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    const [disasters, refetchDisasters, disastersError] = useRecords("/natural_disasters")
    const [cities, refetchCities, citiesError] = useRecords("/cities")

    // Compute slider lower bound from actual data so historical records are accessible.
    // Falls back to 2000-01-01 while data is loading.
    const dateMin = useMemo(() => {
        if (disasters.length === 0) return new Date(Date.UTC(2000, 0, 1))
        let minMs = Infinity
        for (const r of disasters) {
            const t = new Date(r.date).getTime()
            if (!isNaN(t)) minMs = Math.min(minMs, t)
        }
        if (!isFinite(minMs)) return new Date(Date.UTC(2000, 0, 1))
        const d = new Date(minMs)
        return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    }, [disasters])

    const [allDisasters, setAllDisasters] = useState([])
    const [selectedDisaster, setSelectedDisaster] = useState(null)
    const [selectedCity, setSelectedCity] = useState(null)
    const [selectedTypes, setSelectedTypes] = useState(initialSelectedTypes)
    const [dateStart, setDateStart] = useState(new Date(Date.UTC(2000, 0, 1)))
    const [dateEnd, setDateEnd] = useState(dateMax)
    const [showConsolidatedOnly, setShowConsolidatedOnly] = useState(true)
    const [showMarkers, setShowMarkers] = useState(true)

    // Report focus state
    const [focusedEventId, setFocusedEventId] = useState(null)
    const [focusedReports, setFocusedReports] = useState([])
    const [loadingReports, setLoadingReports] = useState(false)

    // Derived state
    const dateStartDebounced = useDebounced(dateStart, 200)
    const dateEndDebounced = useDebounced(dateEnd, 200)

    useEffect(() => {
        if (showConsolidatedOnly) {
            return
        }

        api.get("/natural_disasters/search")
            .then((res) => {
                const records = res?.data?.records
                const data = Array.isArray(records) ? records : Object.values(records || {})
                setAllDisasters(data)
            })
            .catch(() => setAllDisasters([]))
    }, [showConsolidatedOnly])

    const disasterSource = useMemo(() => {
        return showConsolidatedOnly ? disasters : allDisasters
    }, [showConsolidatedOnly, disasters, allDisasters])

    const filteredMainDisasters = useMemo(() => {
        return disasterSource.filter((disaster) => {
            const disasterDate = new Date(disaster.date)
            return (
                (!showConsolidatedOnly || disaster.show !== false) &&
                selectedTypes[disaster.type] &&
                disasterDate &&
                !isNaN(disasterDate.getTime()) &&
                disasterDate.getTime() >= dateStartDebounced.getTime() &&
                disasterDate.getTime() <= dateEndDebounced.getTime()
            )
        })
    }, [
        disasterSource,
        selectedTypes,
        dateStartDebounced,
        dateEndDebounced,
        showConsolidatedOnly,
    ])

    const visibleDisasters = useMemo(() => {
        if (!focusedEventId) {
            return filteredMainDisasters
        }

        const mainEvent = filteredMainDisasters.find(
            (disaster) => disaster._id === focusedEventId
        ) || disasterSource.find(
            (disaster) => disaster._id === focusedEventId
        )

        const filteredReports = focusedReports.filter((report) => {
            const reportDate = new Date(report.date)
            return (
                selectedTypes[report.type] &&
                reportDate &&
                !isNaN(reportDate.getTime()) &&
                reportDate.getTime() >= dateStartDebounced.getTime() &&
                reportDate.getTime() <= dateEndDebounced.getTime()
            )
        })

        return [mainEvent, ...filteredReports].filter(Boolean)
    }, [
        focusedEventId,
        filteredMainDisasters,
        disasterSource,
        focusedReports,
        selectedTypes,
        dateStartDebounced,
        dateEndDebounced,
    ])

    const selectDisaster = (disaster) => {
        setSelectedDisaster(disaster)
        const affectedCity = cities.find(city => {
            return (
                Math.abs(city.latitude - disaster.latitude) < affectedRadius &&
                Math.abs(city.longitude - disaster.longitude) < affectedRadius
            )
        })
        setSelectedCity(affectedCity)
    }

    const closeSelectedDisaster = () => {
        setSelectedDisaster(null)
        setSelectedCity(null)
        setFocusedEventId(null)
        setFocusedReports([])
        setLoadingReports(false)
    }

    const onConsolidatedChange = (checked) => {
        setShowConsolidatedOnly(checked)
        closeSelectedDisaster()
        if (checked) {
            // Ensure we immediately switch back to the consolidated source.
            setAllDisasters([])
            refetchDisasters?.()
        } else if (disastersError) {
            // If the initial load failed (e.g. backend wasn't ready), retry in the background
            // so data is available when the user toggles back.
            refetchDisasters?.()
        }
    }

    const showReports = async () => {
        if (!selectedDisaster?._id) {
            return
        }

        try {
            setLoadingReports(true)
            const res = await api.get(`/natural_disasters/${selectedDisaster._id}/reports`)
            const reports = res?.data?.reports || []

            setFocusedEventId(selectedDisaster._id)
            setFocusedReports(reports)
        } catch {
            setFocusedEventId(selectedDisaster._id)
            setFocusedReports([])
        } finally {
            setLoadingReports(false)
        }
    }

    const hideReports = () => {
        setFocusedEventId(null)
        setFocusedReports([])
    }

    const getHaloRadiusMeters = (disaster) => {
        const severity = Number(disaster?.severity)

        if (!Number.isFinite(severity) || severity <= 0) {
            return 0
        }

        switch (disaster.type) {
            case "earthquake":
                return Math.max(20000, severity * 25000)
            case "hurricane":
                return Math.max(40000, severity * 50000)
            case "tsunami":
                return Math.max(30000, severity * 30000)
            case "landslide":
                return Math.max(10000, severity * 15000)
            default:
                return severity * 20000
        }
    }

    const getHaloOpacity = (disaster) => {
        const severity = Number(disaster?.severity)

        if (!Number.isFinite(severity) || severity <= 0) {
            return 0
        }

        switch (disaster.type) {
            case "earthquake":
                return Math.min(0.35, 0.08 + severity * 0.03)
            case "hurricane":
                return Math.min(0.35, 0.10 + severity * 0.04)
            case "tsunami":
                return Math.min(0.30, 0.08 + severity * 0.025)
            case "landslide":
                return Math.min(0.28, 0.08 + severity * 0.02)
            default:
                return Math.min(0.30, 0.08 + severity * 0.02)
        }
    }

    const renderMarkers = () => {
        return visibleDisasters.flatMap(disaster => {
            if (
                disaster == null ||
                isNaN(disaster.latitude) ||
                isNaN(disaster.longitude)
            ) {
                return []
            }

            const haloRadius = getHaloRadiusMeters(disaster)
            const haloOpacity = getHaloOpacity(disaster)
            const color = colorCode[disaster.type]

            return [-360, 0, 360].flatMap(offset => {
                const position = [disaster.latitude, disaster.longitude + offset]
                const keyBase = `${disaster._id}_${offset}`
                const elements = []

                if (haloRadius > 0) {
                    elements.push(
                        <Circle
                            key={`${keyBase}_halo`}
                            center={position}
                            radius={haloRadius}
                            pathOptions={{
                                color,
                                fillColor: color,
                                fillOpacity: haloOpacity,
                                opacity: 0.35,
                                weight: 1,
                            }}
                        />
                    )
                }

                elements.push(
                    <MapMarker
                        position={position}
                        color={color}
                        key={`${keyBase}_marker`}
                        opacity={showMarkers ? 1 : 0}
                        interactive={showMarkers}
                        eventHandlers={showMarkers ? { click: () => selectDisaster(disaster) } : undefined}
                    />
                )

                return elements
            })
        })
    }

    const renderReportControls = () => {
        if (!selectedDisaster) {
            return null
        }

        const hasReports = Array.isArray(selectedDisaster.reports) && selectedDisaster.reports.length > 0
        if (!hasReports) {
            return null
        }

        const isShowingReports = focusedEventId === selectedDisaster._id

        return (
            <div className="panel-report-controls">
                {!isShowingReports ? (
                    <button
                        className="panel-reports-button"
                        onClick={showReports}
                        disabled={loadingReports}
                    >
                        {loadingReports ? "Loading Reports..." : `Show Reports (${selectedDisaster.reports.length})`}
                    </button>
                ) : (
                    <button
                        className="panel-reports-button"
                        onClick={hideReports}
                    >
                        Hide Reports
                    </button>
                )}
            </div>
        )
    }

    const renderReportList = () => {
        if (!selectedDisaster || focusedEventId !== selectedDisaster._id) {
            return null
        }

        return (
            <div className="panel-reports-list">
                {focusedReports.length <= 0 ? (
                    <p className="panel-report-empty">No linked reports found.</p>
                ) : (
                    focusedReports.map((report) => (
                        <button
                            key={report._id}
                            className="panel-report-item"
                            onClick={() => selectDisaster(report)}
                        >
                            {report.name}, {report.date}
                        </button>
                    ))
                )}
            </div>
        )
    }

    return (
        <div className="page">
            <h1 className="map-title">World Map</h1>

            <MapFilter
                description={`Showing ${visibleDisasters.length} of ${focusedEventId ? visibleDisasters.length : filteredMainDisasters.length}`}
                showConsolidatedOnly={showConsolidatedOnly}
                onConsolidatedChange={onConsolidatedChange}
                showMarkers={showMarkers}
                onMarkersChange={setShowMarkers}
                selectedTypes={selectedTypes}
                dateStart={dateStart}
                dateEnd={dateEnd}
                dateMin={dateMin}
                dateMax={dateMax}
                setSelectedTypes={setSelectedTypes}
                setDateStart={setDateStart}
                setDateEnd={setDateEnd}
            />
            <MapContainer
                center={startPosition}
                zoom={3}
                minZoom={minMapZoom}
                maxZoom={maxMapZoom}
                scrollWheelZoom={true}
                worldCopyJump={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    minZoom={minMapZoom}
                    maxZoom={maxMapZoom}
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {renderMarkers()}
            </MapContainer>

            {(disastersError || citiesError) && (
                <div className="map-error-banner">
                    {disastersError && <span>Could not load disaster data.</span>}
                    {citiesError && <span>Could not load city data.</span>}
                    <button
                        className="map-error-retry"
                        onClick={() => { refetchDisasters?.(); refetchCities?.() }}
                    >
                        Retry
                    </button>
                </div>
            )}
            {selectedDisaster && (
                <div className="disaster-panel">
                    <button className="panel-close" onClick={closeSelectedDisaster}>×</button>
                    <span className="panel-type">{selectedDisaster.type}</span>
                    <h2 className="panel-name">{selectedDisaster.name}</h2>
                    {selectedCity &&
                        <p className="panel-cities">
                            {selectedCity.name}, {selectedCity.state_name}, {selectedCity.nation_name}
                        </p>
                    }
                    <p className="panel-date">{selectedDisaster.date}</p>
                    <p className="panel-description">
                        {selectedDisaster.description}
                    </p>
                    {renderReportControls()}
                    {renderReportList()}
                </div>
            )}
        </div>
    )
}

export default Home