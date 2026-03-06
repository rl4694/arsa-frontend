import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import RecordList from "./RecordList";

vi.mock("../api", () => ({
    default: {
        get: () => {
            return Promise.resolve({
                data: {
                    records: {
                        "1": { _id: "1", name: "California", nation_name: "USA" },
                        "2": { _id: "2", name: "Texas", nation_name: "USA" },
                        "3": { _id: "3", name: "New York", nation_name: "USA" },
                    }
                }
            })
        },
        post: vi.fn(),
        delete: vi.fn(),
        put: vi.fn(),
    },
}))

vi.mock("../components/CreateForm/CreateForm", () => ({
    default: () => <div data-testid="create-form">Create Form</div>,
}))

vi.mock("../components/UpdateForm/UpdateForm", () => ({
    default: () => <div data-testid="update-form">Update Form</div>,
}))

describe("RecordList", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('matches snapshot', () => {
        const sampleFields = [
            { attribute: "name", display: "State Name", type: "text" },
            { attribute: "nation_name", display: "Nation Name", type: "text" },
        ]
        const { container } = render(
            <MemoryRouter>
                <RecordList title="Test" api_path="/test" fields={sampleFields}  />
            </MemoryRouter>
        )
        expect(container).toMatchSnapshot();
    })
})
