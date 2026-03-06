import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import NationList from "./NationList";

vi.mock("../../hooks/useRecord", () => ({
    default: vi.fn(() => {
        return [
            [
                { _id: "1", name: "United States", code: "US" },
                { _id: "2", name: "Canada", code: "CA" },
                { _id: "3", name: "Mexico", code: "MX" },
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

describe("NationList", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

        it('matches snapshot', () => {
        const { container } = render(
            <MemoryRouter>
                <NationList />
            </MemoryRouter>
        )
        expect(container).toMatchSnapshot();
    })
})
