import { useMemo, useState } from 'react'
import { useDebounced } from '../hooks/useDebounced'
import { useRecords } from '../hooks/useRecords'
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
    const [disasters] = useRecords("/natural_disasters")
    const [cities] = useRecords("/cities")
    const [selectedDisaster, setSelectedDisaster] = useState(null)
    const [selectedCity, setSelectedCity] = useState(null)
    const [selectedTypes, setSelectedTypes] = useState(initialSelectedTypes)
    const [dateStart, setDateStart] = useState(dateMin)
    const [dateEnd, setDateEnd] = useState(dateMax)

    // Report focus state
    const [focusedEventId, setFocusedEventId] = useState(null)
    const [focusedReports, setFocusedReports] = useState([])
    const [loadingReports, setLoadingReports] = useState(false)

    // Derived state
    const dateStartDebounced = useDebounced(dateStart, 200)
    const dateEndDebounced = useDebounced(dateEnd, 200)

    const filteredMainDisasters = useMemo(() => {
        return disasters.filter((disaster) => {
            const disasterDate = new Date(disaster.date)
            return (
                disaster.show !== false &&
                selectedTypes[disaster.type] &&
                disasterDate &&
                !isNaN(disasterDate.getTime()) &&
                disasterDate.getTime() >= dateStartDebounced.getTime() &&
                disasterDate.getTime() <= dateEndDebounced.getTime()
            )
        })
    }, [disasters, selectedTypes, dateStartDebounced, dateEndDebounced])

    const visibleDisasters = useMemo(() => {
        if (!focusedEventId) {
            return filteredMainDisasters
        }

        const mainEvent = filteredMainDisasters.find(
            (disaster) => disaster._id === focusedEventId
        ) || disasters.find(
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
        disasters,
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

    // Render functions
    const renderMarkers = () => {
        return visibleDisasters.flatMap(disaster => {
            if (
                disaster == null ||
                isNaN(disaster.latitude) ||
                isNaN(disaster.longitude)
            ) {
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