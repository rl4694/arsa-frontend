import { useMemo } from "react"
import { useRecords } from "../hooks/useRecords"
import {
    totals,
    countByType,
    countByYear,
    avgSeverityByType,
    topNations,
    DISASTER_TYPES,
} from "./compute"
import "./Stats.css"

const TYPE_COLORS = {
    earthquake: "#e74c3c",
    tsunami: "#3498db",
    landslide: "#9b59b6",
    hurricane: "#f39c12",
    other: "#1abc9c",
}

const NEUTRAL_COLOR = "#646cff"

const ROW_HEIGHT = 28
const BAR_HEIGHT = 18
const LABEL_WIDTH = 110
const VALUE_WIDTH = 60
const CHART_PADDING = 8

function BarChart({ data, color, formatValue, ariaLabel }) {
    if (!data || data.length === 0) {
        return <p className="stats-empty">No data yet.</p>
    }

    const maxValue = Math.max(1, ...data.map((d) => d.value))
    const chartWidth = 360
    const innerWidth = chartWidth - LABEL_WIDTH - VALUE_WIDTH - CHART_PADDING * 2
    const height = data.length * ROW_HEIGHT + CHART_PADDING * 2

    return (
        <svg
            viewBox={`0 0 ${chartWidth} ${height}`}
            role="img"
            aria-label={ariaLabel}
            className="stats-chart-svg"
        >
            {data.map((item, idx) => {
                const y = CHART_PADDING + idx * ROW_HEIGHT
                const barWidth = (item.value / maxValue) * innerWidth
                const fill = typeof color === "function" ? color(item.label) : color
                return (
                    <g key={item.label}>
                        <text
                            x={LABEL_WIDTH - 8}
                            y={y + BAR_HEIGHT / 2 + 4}
                            textAnchor="end"
                            className="stats-chart-label"
                        >
                            {item.label}
                        </text>
                        <rect
                            x={LABEL_WIDTH}
                            y={y}
                            width={Math.max(barWidth, item.value > 0 ? 2 : 0)}
                            height={BAR_HEIGHT}
                            rx={3}
                            fill={fill}
                            opacity={item.value > 0 ? 0.9 : 0.25}
                        />
                        <text
                            x={LABEL_WIDTH + Math.max(barWidth, 0) + 6}
                            y={y + BAR_HEIGHT / 2 + 4}
                            className="stats-chart-value"
                        >
                            {formatValue ? formatValue(item.value) : item.value}
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}

function KpiCard({ label, value, hint }) {
    return (
        <div className="stats-kpi">
            <div className="stats-kpi-value">{value}</div>
            <div className="stats-kpi-label">{label}</div>
            {hint && <div className="stats-kpi-hint">{hint}</div>}
        </div>
    )
}

function Stats() {
    const [disasters, refetchDisasters, disastersError] = useRecords("/natural_disasters")
    const [cities, refetchCities, citiesError] = useRecords("/cities")

    const summary = useMemo(() => totals(disasters), [disasters])
    const byType = useMemo(() => countByType(disasters), [disasters])
    const byYear = useMemo(() => countByYear(disasters), [disasters])
    const avgSeverity = useMemo(() => avgSeverityByType(disasters), [disasters])
    const nations = useMemo(() => topNations(disasters, cities), [disasters, cities])

    const formatInt = (n) => Math.round(n).toLocaleString()
    const formatDecimal = (n) => (n > 0 ? n.toFixed(2) : "—")

    return (
        <div className="stats-page">
            <h1 className="stats-title">Disaster Statistics</h1>

            {(disastersError || citiesError) && (
                <div className="stats-error">
                    {disastersError && <span>Could not load disaster data. </span>}
                    {citiesError && <span>Could not load city data. </span>}
                    <button
                        className="stats-error-retry"
                        onClick={() => { refetchDisasters?.(); refetchCities?.() }}
                    >
                        Retry
                    </button>
                </div>
            )}

            <section className="stats-kpi-row">
                <KpiCard label="Total events" value={formatInt(summary.totalEvents)} />
                <KpiCard label="Linked reports" value={formatInt(summary.totalReports)} />
                <KpiCard
                    label="Avg severity"
                    value={summary.avgSeverity > 0 ? summary.avgSeverity.toFixed(2) : "—"}
                    hint="across events with severity"
                />
                <KpiCard label="Last 30 days" value={formatInt(summary.last30Days)} />
            </section>

            <section className="stats-grid">
                <article className="stats-card">
                    <h2 className="stats-card-title">Events by type</h2>
                    <BarChart
                        data={byType}
                        color={(label) => TYPE_COLORS[label] || NEUTRAL_COLOR}
                        ariaLabel="Number of disaster events by type"
                    />
                </article>

                <article className="stats-card">
                    <h2 className="stats-card-title">Events per year</h2>
                    <BarChart
                        data={byYear}
                        color={NEUTRAL_COLOR}
                        ariaLabel="Number of disaster events per year"
                    />
                </article>

                <article className="stats-card">
                    <h2 className="stats-card-title">Average severity by type</h2>
                    <BarChart
                        data={avgSeverity}
                        color={(label) => TYPE_COLORS[label] || NEUTRAL_COLOR}
                        formatValue={formatDecimal}
                        ariaLabel="Average severity by disaster type"
                    />
                </article>

                <article className="stats-card">
                    <h2 className="stats-card-title">Top nations affected</h2>
                    {nations.length > 0 ? (
                        <BarChart
                            data={nations}
                            color={NEUTRAL_COLOR}
                            ariaLabel="Top nations by number of disaster events"
                        />
                    ) : (
                        <p className="stats-empty">
                            Need city data with coordinates to attribute events to nations.
                        </p>
                    )}
                </article>
            </section>

            <p className="stats-footnote">
                Computed from {summary.totalEvents.toLocaleString()} consolidated events across{" "}
                {DISASTER_TYPES.length} categories.
            </p>
        </div>
    )
}

export default Stats
