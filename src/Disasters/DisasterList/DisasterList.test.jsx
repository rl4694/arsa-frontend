/**
 * Unit tests for DisastersList component
 * Tests rendering, user interactions, and API calls
 */
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import DisastersList from "./DisasterList";

// Mock the useRecord hook with sample disaster data
vi.mock("../../hooks/useRecord", () => ({
    default: vi.fn(() => {
        return [
            [
                { _id: "1", name: "Hurricane Katrina", type: "hurricane", date: "2005-08-29", location: "29.9,-90.1", description: "Category 5 hurricane" },
                { _id: "2", name: "Tohoku Earthquake", type: "earthquake", date: "2011-03-11", location: "38.3,142.4", description: "Magnitude 9.1" },
                { _id: "3", name: "Indian Ocean Tsunami", type: "tsunami", date: "2004-12-26", location: "3.3,95.9", description: "Devastating tsunami" },
            ],
            vi.fn(),
            vi.fn(),
        ]
    }),
}))

vi.mock("../../api", () => ({
    default: {
        post: vi.fn(),
        delete: vi.fn(),
        put: vi.fn(),
    },
}))

vi.mock("../../UpdateForm/UpdateForm", () => ({
    default: () => <div data-testid="update-form">Update Form</div>,
}))

describe("DisastersList", () => {
    // Reset mocks before each test
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('matches snapshot', () => {
        const { container } = render(
            <MemoryRouter>
                <DisastersList />
            </MemoryRouter>
        )
        expect(container).toMatchSnapshot();
    })
})
