import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Home from "./Home";

describe('Home', () => {
    it('matches snapshot', () => {
        const { container } = render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )
        expect(container).toMatchSnapshot();
    })
})