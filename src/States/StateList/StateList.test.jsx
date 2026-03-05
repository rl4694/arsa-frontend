import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

    it("renders the title", () => {
        render(
            <MemoryRouter>
                <StatesList />
            </MemoryRouter>
        )
        expect(screen.getByText("States")).toBeTruthy()
    })

    it("renders the create form", () => {
        render(
            <MemoryRouter>
                <StatesList />
            </MemoryRouter>
        )
        expect(screen.getByText("Add New State")).toBeTruthy()
    })

    it("renders sample data in the table", () => {
        render(
            <MemoryRouter>
                <StatesList />
            </MemoryRouter>
        )
        expect(screen.getByText("California")).toBeTruthy()
        expect(screen.getByText("Texas")).toBeTruthy()
    })

    it("renders table headers", () => {
        render(
            <MemoryRouter>
                <StatesList />
            </MemoryRouter>
        )
        expect(screen.getAllByText("State Name").length).toBeGreaterThan(0)
        expect(screen.getAllByText("Nation Name").length).toBeGreaterThan(0)
    })

    it("renders delete buttons for each row", () => {
        render(
            <MemoryRouter>
                <StatesList />
            </MemoryRouter>
        )
        const deleteButtons = screen.getAllByText("Delete")
        expect(deleteButtons.length).toBe(3)
    })

    it("renders edit buttons for each row", () => {
        render(
            <MemoryRouter>
                <StatesList />
            </MemoryRouter>
        )
        const editButtons = screen.getAllByText("Edit")
        expect(editButtons.length).toBe(3)
    })

    it("shows confirm dialog when delete is clicked", () => {
        const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false)
        
        render(
            <MemoryRouter>
                <StatesList />
            </MemoryRouter>
        )
        
        const deleteButtons = screen.getAllByText("Delete")
        fireEvent.click(deleteButtons[0])
        
        expect(confirmSpy).toHaveBeenCalled()
        confirmSpy.mockRestore()
    })

    it("calls api.delete when delete is confirmed", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true)
        const api = await import("../../api")
        
        render(
            <MemoryRouter>
                <StatesList />
            </MemoryRouter>
        )
        
        const deleteButtons = screen.getAllByText("Delete")
        fireEvent.click(deleteButtons[0])
        
        await waitFor(() => {
            expect(api.default.delete).toHaveBeenCalledWith("/states/1")
        })
    })
})
