import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Navbar from "./Navbar";

describe('Navbar', () => {
    it('matches snapshot', () => {
        const { container } = render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        )
        expect(container).toMatchSnapshot();
    })
})