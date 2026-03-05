import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MapMarker from "./MapMarker";

vi.mock("react-leaflet", () => ({
    MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
    TileLayer: () => <div data-testid="tile" />,
    Marker: ({ children, ...props }) => (
        <div data-testid="marker" {...props}>{children}</div>
    ),
}));

describe('MapMarker', () => {
    it('matches snapshot', () => {
        const { container } = render(

            <MapMarker />
        )
        expect(container).toMatchSnapshot();
    })
})