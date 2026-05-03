import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import Stats from "./Stats"

vi.mock("../api", () => ({
    default: {
        get: (path) => {
            if (path === "/natural_disasters") {
                return Promise.resolve({
                    data: {
                        records: {
                            d1: {
                                _id: "d1",
                                name: "Quake A",
                                type: "earthquake",
                                date: "2026-04-20",
                                latitude: 35.0,
                                longitude: 139.0,
                                severity: 5,
                                reports: ["r1"],
                            },
                            d2: {
                                _id: "d2",
                                name: "Quake B",
                                type: "earthquake",
                                date: "2025-08-12",
                                latitude: 36.0,
                                longitude: 138.0,
                                severity: 4,
                                reports: [],
                            },
                            d3: {
                                _id: "d3",
                                name: "Wave",
                                type: "tsunami",
                                date: "2024-01-10",
                                latitude: 38.0,
                                longitude: 140.0,
                                severity: 8,
                                reports: [],
                            },
                        },
                    },
                })
            }
            if (path === "/cities") {
                return Promise.resolve({
                    data: {
                        records: {
                            c1: {
                                name: "Tokyo",
                                nation_name: "Japan",
                                latitude: 35.68,
                                longitude: 139.69,
                            },
                        },
                    },
                })
            }
            return Promise.resolve({ data: { records: {} } })
        },
    },
}))

vi.setSystemTime(new Date("2026-05-03T00:00:00Z"))

describe("Stats", () => {
    it("renders KPI cards and chart titles", async () => {
        render(
            <MemoryRouter>
                <Stats />
            </MemoryRouter>
        )

        expect(
            await screen.findByRole("heading", { name: /Disaster Statistics/i })
        ).toBeDefined()

        await waitFor(() => {
            expect(screen.getByText("Total events").textContent).toBeTruthy()
        })

        expect(screen.getByText("Total events")).toBeDefined()
        expect(screen.getByText("Linked reports")).toBeDefined()
        expect(screen.getByText("Avg severity")).toBeDefined()
        expect(screen.getByText("Last 30 days")).toBeDefined()

        expect(screen.getByText("Events by type")).toBeDefined()
        expect(screen.getByText("Events per year")).toBeDefined()
        expect(screen.getByText("Average severity by type")).toBeDefined()
        expect(screen.getByText("Top nations affected")).toBeDefined()
    })

    it("renders SVG charts with accessible labels", async () => {
        render(
            <MemoryRouter>
                <Stats />
            </MemoryRouter>
        )

        const charts = await screen.findAllByRole("img")
        expect(charts.length).toBeGreaterThanOrEqual(3)
    })
})
