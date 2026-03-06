import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import StatesList from "./StateList";

vi.mock("../../hooks/useRecord", () => ({
    default: vi.fn(() => {
        return [
            [
                { _id: "1", name: "California", nation_name: "USA" },
                { _id: "2", name: "Texas", nation_name: "USA" },
                { _id: "3", name: "New York", nation_name: "USA" },
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

describe("StatesList", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('matches snapshot', () => {
        const { container } = render(
            <MemoryRouter>
                <StatesList />
            </MemoryRouter>
        )
        expect(container).toMatchSnapshot();
    })
})
