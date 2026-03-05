import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Home from "./Home";

vi.mock("../hooks/useRecord", () => ({
    default: vi.fn(() => {
        return [
            [
                {
                    _id: "66170c5af3d27e919f30b100",
                    name: "Big Earthquake",
                    type: "earthquake",
                    location: "10.0, 20.0",
                    date: "2024-02-01",
                    description: "Major event",
                },
            ],
            vi.fn(),
        ]
    }),
}))

vi.mock("react-leaflet", () => ({
    MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
    TileLayer: () => <div data-testid="tile" />,
}));

vi.mock("../components/Marker/MapMarker", () => ({
    default: ({ children }) => (
        <div data-testid="marker">{children}</div>
    ),
}));

describe('Home', () => {
    it('matches snapshot', async () => {
        const { container } = render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )
        await screen.findByText("Big Earthquake");
        expect(container).toMatchSnapshot();
    })
})