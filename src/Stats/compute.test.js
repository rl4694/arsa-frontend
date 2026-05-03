import { describe, expect, it } from "vitest"
import {
    totals,
    countByType,
    countByYear,
    avgSeverityByType,
    topNations,
    haversineKm,
    DISASTER_TYPES,
} from "./compute"

const NOW = new Date("2026-05-03T00:00:00Z")

const sampleDisasters = [
    {
        _id: "a",
        type: "earthquake",
        date: "2026-05-01",
        severity: 6,
        latitude: 35.0,
        longitude: 139.0,
        reports: ["r1", "r2"],
    },
    {
        _id: "b",
        type: "earthquake",
        date: "2025-08-12",
        severity: 4,
        latitude: 36.0,
        longitude: 138.0,
        reports: [],
    },
    {
        _id: "c",
        type: "Tsunami",
        date: "2024-01-10",
        severity: 8,
        latitude: 38.0,
        longitude: 140.0,
        reports: ["r3"],
    },
    {
        _id: "d",
        type: "hurricane",
        date: "2026-04-20",
        severity: null,
        latitude: 25.0,
        longitude: -80.0,
        reports: [],
    },
    {
        _id: "e",
        type: "weird-type",
        date: "bad-date",
        latitude: null,
        longitude: null,
    },
]

const sampleCities = [
    { name: "Tokyo", nation_name: "Japan", latitude: 35.68, longitude: 139.69 },
    { name: "Sendai", nation_name: "Japan", latitude: 38.27, longitude: 140.87 },
    { name: "Miami", nation_name: "USA", latitude: 25.76, longitude: -80.19 },
    { name: "Empty", nation_name: "", latitude: 0, longitude: 0 },
]

describe("haversineKm", () => {
    it("returns 0 for identical points", () => {
        expect(haversineKm(40, -74, 40, -74)).toBe(0)
    })

    it("computes a known distance NYC to LA within tolerance", () => {
        const dist = haversineKm(40.7128, -74.006, 34.0522, -118.2437)
        expect(dist).toBeGreaterThan(3900)
        expect(dist).toBeLessThan(4000)
    })
})

describe("totals", () => {
    it("counts events, reports, severity, and recent events", () => {
        const result = totals(sampleDisasters, { now: NOW })
        expect(result.totalEvents).toBe(5)
        expect(result.totalReports).toBe(3)
        expect(result.avgSeverity).toBeCloseTo((6 + 4 + 8) / 3, 5)
        expect(result.last30Days).toBe(2)
    })

    it("handles empty / non-array input", () => {
        expect(totals([], { now: NOW })).toEqual({
            totalEvents: 0,
            totalReports: 0,
            avgSeverity: 0,
            last30Days: 0,
        })
        expect(totals(null, { now: NOW }).totalEvents).toBe(0)
    })
})

describe("countByType", () => {
    it("returns one entry per known type and folds unknown into other", () => {
        const result = countByType(sampleDisasters)
        expect(result).toHaveLength(DISASTER_TYPES.length)

        const map = Object.fromEntries(result.map((r) => [r.label, r.value]))
        expect(map.earthquake).toBe(2)
        expect(map.tsunami).toBe(1)
        expect(map.hurricane).toBe(1)
        expect(map.landslide).toBe(0)
        expect(map.other).toBe(1)
    })

    it("returns zeroed buckets for empty input", () => {
        const result = countByType([])
        expect(result.every((r) => r.value === 0)).toBe(true)
    })
})

describe("countByYear", () => {
    it("buckets disasters by year over the requested window", () => {
        const result = countByYear(sampleDisasters, { years: 5, now: NOW })
        expect(result).toHaveLength(5)
        expect(result.map((r) => r.label)).toEqual([
            "2022",
            "2023",
            "2024",
            "2025",
            "2026",
        ])

        const map = Object.fromEntries(result.map((r) => [r.label, r.value]))
        expect(map["2026"]).toBe(2)
        expect(map["2025"]).toBe(1)
        expect(map["2024"]).toBe(1)
        expect(map["2022"]).toBe(0)
    })
})

describe("avgSeverityByType", () => {
    it("averages severity per type and ignores missing values", () => {
        const result = avgSeverityByType(sampleDisasters)
        const map = Object.fromEntries(result.map((r) => [r.label, r.value]))
        expect(map.earthquake).toBeCloseTo(5, 5)
        expect(map.tsunami).toBeCloseTo(8, 5)
        expect(map.hurricane).toBe(0)
        expect(map.landslide).toBe(0)
    })
})

describe("topNations", () => {
    it("attributes events to the nearest city's nation", () => {
        const result = topNations(sampleDisasters, sampleCities, { limit: 5 })
        const map = Object.fromEntries(result.map((r) => [r.label, r.value]))
        expect(map.Japan).toBe(3)
        expect(map.USA).toBe(1)
    })

    it("returns an empty array if no cities are provided", () => {
        expect(topNations(sampleDisasters, [])).toEqual([])
    })

    it("respects the limit", () => {
        const result = topNations(sampleDisasters, sampleCities, { limit: 1 })
        expect(result).toHaveLength(1)
        expect(result[0].label).toBe("Japan")
    })

    it("ignores events whose nearest city is beyond maxDistanceKm", () => {
        const result = topNations(sampleDisasters, sampleCities, {
            maxDistanceKm: 1,
        })
        expect(result).toEqual([])
    })
})
