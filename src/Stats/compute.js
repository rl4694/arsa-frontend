/*
 * Pure helpers for computing disaster statistics from a list of records.
 * Kept framework-free so they can be unit-tested in isolation.
 */

export const DISASTER_TYPES = [
    "earthquake",
    "tsunami",
    "landslide",
    "hurricane",
    "other",
]

const EARTH_RADIUS_KM = 6371

const toNumber = (value) => {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
}

const normalizeType = (type) => {
    if (typeof type !== "string") {
        return "other"
    }
    const lower = type.toLowerCase()
    return DISASTER_TYPES.includes(lower) ? lower : "other"
}

const yearOf = (dateStr) => {
    if (typeof dateStr !== "string" || dateStr.length < 4) {
        return null
    }
    const year = parseInt(dateStr.slice(0, 4), 10)
    return Number.isFinite(year) ? year : null
}

export function haversineKm(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return EARTH_RADIUS_KM * c
}

export function totals(disasters, { now = new Date() } = {}) {
    const list = Array.isArray(disasters) ? disasters : []
    const totalEvents = list.length

    let totalReports = 0
    let severitySum = 0
    let severityCount = 0
    let last30 = 0

    const cutoff = now.getTime() - 30 * 24 * 60 * 60 * 1000

    list.forEach((d) => {
        if (Array.isArray(d?.reports)) {
            totalReports += d.reports.length
        }
        const sev = toNumber(d?.severity)
        if (sev !== null && sev > 0) {
            severitySum += sev
            severityCount += 1
        }
        if (typeof d?.date === "string") {
            const t = new Date(d.date).getTime()
            if (Number.isFinite(t) && t >= cutoff && t <= now.getTime()) {
                last30 += 1
            }
        }
    })

    return {
        totalEvents,
        totalReports,
        avgSeverity: severityCount > 0 ? severitySum / severityCount : 0,
        last30Days: last30,
    }
}

export function countByType(disasters) {
    const counts = Object.fromEntries(DISASTER_TYPES.map((t) => [t, 0]))
    if (!Array.isArray(disasters)) {
        return DISASTER_TYPES.map((label) => ({ label, value: 0 }))
    }
    disasters.forEach((d) => {
        counts[normalizeType(d?.type)] += 1
    })
    return DISASTER_TYPES.map((label) => ({ label, value: counts[label] }))
}

export function countByYear(disasters, { years = 10, now = new Date() } = {}) {
    const currentYear = now.getUTCFullYear()
    const buckets = new Map()
    for (let i = years - 1; i >= 0; i -= 1) {
        buckets.set(currentYear - i, 0)
    }

    if (Array.isArray(disasters)) {
        disasters.forEach((d) => {
            const year = yearOf(d?.date)
            if (year !== null && buckets.has(year)) {
                buckets.set(year, buckets.get(year) + 1)
            }
        })
    }

    return Array.from(buckets.entries()).map(([year, value]) => ({
        label: String(year),
        value,
    }))
}

export function avgSeverityByType(disasters) {
    const sums = Object.fromEntries(DISASTER_TYPES.map((t) => [t, 0]))
    const counts = Object.fromEntries(DISASTER_TYPES.map((t) => [t, 0]))

    if (Array.isArray(disasters)) {
        disasters.forEach((d) => {
            const sev = toNumber(d?.severity)
            if (sev === null || sev <= 0) {
                return
            }
            const type = normalizeType(d?.type)
            sums[type] += sev
            counts[type] += 1
        })
    }

    return DISASTER_TYPES.map((label) => ({
        label,
        value: counts[label] > 0 ? sums[label] / counts[label] : 0,
    }))
}

/*
 * Group disasters by nation by snapping each event to the closest known city
 * within `maxDistanceKm`. Cities far from any event are ignored. Returns the
 * top `limit` nations by event count, descending.
 */
export function topNations(
    disasters,
    cities,
    { limit = 10, maxDistanceKm = 500 } = {}
) {
    if (!Array.isArray(disasters) || !Array.isArray(cities) || cities.length === 0) {
        return []
    }

    const cityList = cities.filter(
        (c) =>
            typeof c?.nation_name === "string" &&
            c.nation_name.length > 0 &&
            toNumber(c?.latitude) !== null &&
            toNumber(c?.longitude) !== null
    )
    if (cityList.length === 0) {
        return []
    }

    const counts = new Map()
    disasters.forEach((d) => {
        const lat = toNumber(d?.latitude)
        const lon = toNumber(d?.longitude)
        if (lat === null || lon === null) {
            return
        }

        let nearestNation = null
        let nearestDist = Infinity
        for (const city of cityList) {
            const dist = haversineKm(lat, lon, city.latitude, city.longitude)
            if (dist < nearestDist) {
                nearestDist = dist
                nearestNation = city.nation_name
            }
        }

        if (nearestNation && nearestDist <= maxDistanceKm) {
            counts.set(nearestNation, (counts.get(nearestNation) || 0) + 1)
        }
    })

    return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([label, value]) => ({ label, value }))
}
