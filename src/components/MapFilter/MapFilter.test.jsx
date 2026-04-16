import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MapFilter from "./MapFilter";

describe('MapFilter', () => {
    it('matches snapshot', () => {
        const dateMin = new Date(Date.UTC(2000, 0, 1))
        const dateMax = new Date(Date.UTC(2026, 0, 1))
        const { container } = render(
            <MapFilter
                description={'test'}
                selectedTypes={[]}
                showConsolidatedOnly={true}
                onConsolidatedChange={vi.fn()}
                showMarkers={true}
                onMarkersChange={vi.fn()}
                dateStart={dateMin}
                dateEnd={dateMax}
                dateMin={dateMin}
                dateMax={dateMax}
                setSelectedTypes={vi.fn()}
                setDateStart={vi.fn()}
                setDateEnd={vi.fn()}
            />
        )
        expect(container).toMatchSnapshot();
    })
})