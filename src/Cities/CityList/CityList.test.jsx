import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import CityList from "./CityList";

vi.mock("../../hooks/useRecord", () => ({
    default: vi.fn(() => {
        return [
            [
                { _id: "1", name: "New York", state_name: "New York", nation_name: "USA", latitude: 40.7, longitude: -74.0 },
                { _id: "2", name: "Los Angeles", state_name: "California", nation_name: "USA", latitude: 34.0, longitude: -118.2 },
                { _id: "3", name: "Chicago", state_name: "Illinois", nation_name: "USA", latitude: 41.9, longitude: -87.6 },
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

describe("CityList", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders the title", () => {
        render(
            <MemoryRouter>
                <CityList />
            </MemoryRouter>
        )
        expect(screen.getByText("Cities")).toBeTruthy()
    })

    it("renders the create form", () => {
        render(
            <MemoryRouter>
                <CityList />
            </MemoryRouter>
        )
        expect(screen.getByText("Add New City")).toBeTruthy()
    })

    it("renders sample data in the table", () => {
        render(
            <MemoryRouter>
                <CityList />
            </MemoryRouter>
        )
        expect(screen.getByText("Los Angeles")).toBeTruthy()
        expect(screen.getByText("Chicago")).toBeTruthy()
    })

    it("renders table headers", () => {
        render(
            <MemoryRouter>
                <CityList />
            </MemoryRouter>
        )
        expect(screen.getAllByText("State Name")).toBeTruthy()
        expect(screen.getAllByText("Nation Name")).toBeTruthy()
        expect(screen.getAllByText("Latitude")).toBeTruthy()
    })

    // it("renders delete buttons for each row", () => {
    //     render(
    //         <MemoryRouter>
    //             <CityList />
    //         </MemoryRouter>
    //     )
    //     const deleteButtons = screen.getAllByText("Delete")
    //     expect(deleteButtons.length).toBe(3)
    // })

    // it("renders edit buttons for each row", () => {
    //     render(
    //         <MemoryRouter>
    //             <CityList />
    //         </MemoryRouter>
    //     )
    //     const editButtons = screen.getAllByText("Edit")
    //     expect(editButtons.length).toBe(3)
    // })

    // it("shows confirm dialog when delete is clicked", () => {
    //     const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false)
        
    //     render(
    //         <MemoryRouter>
    //             <CityList />
    //         </MemoryRouter>
    //     )
        
    //     const deleteButtons = screen.getAllByText("Delete")
    //     fireEvent.click(deleteButtons[0])
        
    //     expect(confirmSpy).toHaveBeenCalled()
    //     confirmSpy.mockRestore()
    // })

    // it("calls api.delete when delete is confirmed", async () => {
    //     vi.spyOn(window, "confirm").mockReturnValue(true)
    //     const api = await import("../../api")
        
    //     render(
    //         <MemoryRouter>
    //             <CityList />
    //         </MemoryRouter>
    //     )
        
    //     const deleteButtons = screen.getAllByText("Delete")
    //     fireEvent.click(deleteButtons[0])
        
    //     await waitFor(() => {
    //         expect(api.default.delete).toHaveBeenCalledWith("/cities/1")
    //     })
    // })
})
