import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import RecordList from "./RecordList";

vi.mock("../api", () => ({
    default: {
        get: (url) => {
            if (url == "/test") {
                return Promise.resolve({
                    data: {
                        records: {
                            "1": { _id: "1", name: "California", nation_name: "USA" },
                            "2": { _id: "2", name: "Texas", nation_name: "USA" },
                            "3": { _id: "3", name: "New York", nation_name: "USA" },
                        }
                    }
                })
            }
            else if (url == "/test/fields") {
                return Promise.resolve({
                    data: [
                        { attribute: "name", display: "State Name", type: "text" },
                        { attribute: "nation_name", display: "Nation Name", type: "text" },
                    ]
                })
            }
        },
        post: vi.fn(),
        delete: vi.fn(),
        put: vi.fn(),
    },
}))

vi.mock("../Auth/AuthProvider/useAuth", () => ({
    useAuth: () => ({ user: null }),
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

    it('matches snapshot', async () => {
        const { container } = render(
            <MemoryRouter>
                <RecordList title="Test" api_path="/test" />
            </MemoryRouter>
        )
        
        await waitFor(() => {
            expect(container.querySelector('.background')).toBeInTheDocument()
        })
        
        expect(container).toMatchSnapshot();
    })
})
