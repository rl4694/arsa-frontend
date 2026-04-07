import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MapFilter from "./MapFilter";

describe('MapFilter', () => {
    it('matches snapshot', () => {
        const dateMin = new Date("2000-01-01T00:00:00")
        const dateMax = new Date("2026-01-01T00:00:00")
        const { container } = render(
            <MapFilter
                description={'test'}
                selectedTypes={[]}
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