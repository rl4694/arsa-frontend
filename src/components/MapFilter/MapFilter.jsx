import { useMemo, useState, useRef } from 'react'
import DatePicker from 'react-datepicker'
import { enUS } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'
import './MapFilter.css'

function MapFilter({
    description,
    showConsolidatedOnly,
    onConsolidatedChange,
    showMarkers,
    onMarkersChange,
    selectedTypes,
    dateStart,
    dateEnd,
    dateMin,
    dateMax,
    setSelectedTypes,
    setDateStart,
    setDateEnd
}) {
    // Convert a Date object into a string
    const dateToString = (d) => {
        const y = d.getUTCFullYear()
        const m = String(d.getUTCMonth() + 1).padStart(2, "0")
        const day = String(d.getUTCDate()).padStart(2, "0")
        return `${y}-${m}-${day}`
    }

    const [filtersOpen, setFiltersOpen] = useState(true)
    const [dateWarning, setDateWarning] = useState(null)
    const rawWasInvalid = useRef(false)

    // Keep date labels stable across local timezones.
    const dateToLabel = (d) => {
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
        })
    }

    // Convert an input into a Date object
    const inputToDate = (input, inputType) => {
        switch (inputType) {
            case 'date': {
                if (!input || typeof input !== "string") return null
                const parts = input.split("-").map(Number)
                if (parts.length !== 3 || parts.some(Number.isNaN)) return null
                const [y, m, d] = parts
                return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0))
            }
            case 'range':
                if (isNaN(input)) return
                return new Date(parseInt(input, 10))
            default:
                return null
        }
    }

    // Clamp a Date object into the valid date range
    const clampDate = (d) => {
        const t = d.getTime()
        const minT = dateMin.getTime()
        const maxT = dateMax.getTime()
        if (t < minT) return new Date(minT)
        if (t > maxT) return new Date(maxT)
        return d
    }

    const toPickerDate = (d) => new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())

    const minDatePicker = useMemo(() => toPickerDate(dateMin), [dateMin])
    const maxDatePicker = useMemo(() => toPickerDate(dateMax), [dateMax])

    const normalizePickerDate = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0))

    const checkRawDateInput = (rawValue) => {
        if (!rawValue || rawValue.length !== 10) return
        const parts = rawValue.split('-').map(Number)
        if (parts.length !== 3 || parts.some(Number.isNaN)) return
        const [y, m, d] = parts
        const parsed = new Date(Date.UTC(y, m - 1, d))
        if (
            parsed.getUTCFullYear() !== y ||
            parsed.getUTCMonth() + 1 !== m ||
            parsed.getUTCDate() !== d
        ) {
            rawWasInvalid.current = true
            setDateWarning(`"${rawValue}" is not a valid date — date was adjusted.`)
            return
        }
        const clamped = clampDate(parsed)
        if (clamped.getTime() !== parsed.getTime()) {
            rawWasInvalid.current = true
            setDateWarning(`"${rawValue}" is outside the available range — date was adjusted.`)
            return
        }
        rawWasInvalid.current = false
        setDateWarning(null)
    }

    const onDisasterTypeChange = (type) => {
        setSelectedTypes(prev => ({ ...prev, [type]: !prev[type] }))
    }

    const onDateChange = (input, inputType, dateType) => {
        // Convert the input into a valid date
        const parsed = inputToDate(input, inputType)
        if (!parsed) {
            return
        }
        const next = clampDate(parsed)

        // Set the date states according to the date type
        switch (dateType) {
            case 'start':
                setDateStart(next)
                if (next.getTime() > dateEnd.getTime()) {
                    setDateEnd(next)
                }
                break
            case 'end':
                setDateEnd(next)
                if (next.getTime() < dateStart.getTime()) {
                    setDateStart(next)
                }
                break
        }
    }

    const onPickerDateChange = (picked, dateType) => {
        if (!picked) return
        const normalized = normalizePickerDate(picked)
        const next = clampDate(normalized)

        if (next.getTime() !== normalized.getTime()) {
            rawWasInvalid.current = false
            setDateWarning(`"${dateToString(normalized)}" is outside the available range — date was adjusted.`)
        } else if (!rawWasInvalid.current) {
            setDateWarning(null)
        }
        rawWasInvalid.current = false

        if (dateType === 'start') {
            setDateStart(next)
            if (next.getTime() > dateEnd.getTime()) {
                setDateEnd(next)
            }
            return
        }

        setDateEnd(next)
        if (next.getTime() < dateStart.getTime()) {
            setDateStart(next)
        }
    }

    return (
        <div className="map-filters">
            <div className="filters-header">
                <h2>Filters</h2>
                <button
                    type="button"
                    className={`filters-toggle ${filtersOpen ? "filters-toggle-open" : ""}`}
                    onClick={() => setFiltersOpen((o) => !o)}
                    aria-expanded={filtersOpen}
                    aria-label={filtersOpen ? "Hide filters" : "Show filters"}
                >
                    <span className="filters-toggle-icon" aria-hidden />
                </button>
            </div>
            {filtersOpen && (
                <>
                    <p className="filter-summary">{description}</p>

                    <label className="filter-label">Data</label>
                    <label className="type-checkbox-label">
                        <input
                            type="checkbox"
                            checked={!!showConsolidatedOnly}
                            onChange={(e) => onConsolidatedChange?.(e.target.checked)}
                            aria-describedby="consolidated-help"
                        />
                        Show consolidated only
                    </label>
                    <p id="consolidated-help" className="filter-help">
                        Shows one merged event per incident instead of all individual reports.
                    </p>
                    <label className="type-checkbox-label">
                        <input
                            type="checkbox"
                            checked={showMarkers !== false}
                            onChange={(e) => onMarkersChange?.(e.target.checked)}
                        />
                        Show markers
                    </label>

                    <label className="filter-label">Type</label>
                    <div className="type-checkboxes">
                        {["earthquake", "landslide", "tsunami", "hurricane"].map(type => (
                            <label key={type} className="type-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={selectedTypes[type]}
                                    onChange={() => onDisasterTypeChange(type)}
                                />
                                <span className={`type-dot type-dot-${type}`}></span>
                                {type}
                            </label>
                        ))}
                    </div>

                    <label className="filter-label" htmlFor="date-start-input">
                        Start date
                    </label>
                    <DatePicker
                        id="date-start-input"
                        selected={toPickerDate(dateStart)}
                        onChange={(d) => onPickerDateChange(d, 'start')}
                        onChangeRaw={(e) => checkRawDateInput(e.target.value)}
                        minDate={minDatePicker}
                        maxDate={maxDatePicker}
                        locale={enUS}
                        dateFormat="yyyy-MM-dd"
                        className="filter-date-input"
                        calendarClassName="map-filter-datepicker"
                        popperClassName="map-filter-datepicker-popper"
                        showPopperArrow={false}
                    />

                    <label htmlFor="date-start-slider">
                        Start: <strong>{dateToLabel(dateStart)}</strong>
                    </label>
                    <input
                        id="date-start-slider"
                        type="range"
                        min={dateMin.getTime()}
                        max={dateMax.getTime()}
                        step={(dateMax.getTime() - dateMin.getTime()) / 100}
                        value={dateStart.getTime()}
                        onChange={(e) => onDateChange(e.target.value, 'range', 'start')}
                    />

                    <label className="filter-label" htmlFor="date-end-input">
                        End date
                    </label>
                    <DatePicker
                        id="date-end-input"
                        selected={toPickerDate(dateEnd)}
                        onChange={(d) => onPickerDateChange(d, 'end')}
                        onChangeRaw={(e) => checkRawDateInput(e.target.value)}
                        minDate={minDatePicker}
                        maxDate={maxDatePicker}
                        locale={enUS}
                        dateFormat="yyyy-MM-dd"
                        className="filter-date-input"
                        calendarClassName="map-filter-datepicker"
                        popperClassName="map-filter-datepicker-popper"
                        showPopperArrow={false}
                    />

                    <label htmlFor="date-end-slider">
                        End: <strong>{dateToLabel(dateEnd)}</strong>
                    </label>
                    <input
                        id="date-end-slider"
                        type="range"
                        min={dateMin.getTime()}
                        max={dateMax.getTime()}
                        step={(dateMax.getTime() - dateMin.getTime()) / 100}
                        value={dateEnd.getTime()}
                        onChange={(e) => onDateChange(e.target.value, 'range', 'end')}
                    />
                    {dateWarning && (
                        <p className="filter-warning">{dateWarning}</p>
                    )}
                </>
            )}
        </div>
    )
}

export default MapFilter