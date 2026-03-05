import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

    it("renders the title", () => {
        render(
            <MemoryRouter>
                <NationList />
            </MemoryRouter>
        )
        expect(screen.getByText("Nations")).toBeTruthy()
    })

    it("renders the create form", () => {
        render(
            <MemoryRouter>
                <NationList />
            </MemoryRouter>
        )
        expect(screen.getByText("Add New Nation")).toBeTruthy()
    })

    it("renders sample data in the table", () => {
        render(
            <MemoryRouter>
                <NationList />
            </MemoryRouter>
        )
        expect(screen.getByText("United States")).toBeTruthy()
        expect(screen.getByText("Canada")).toBeTruthy()
        expect(screen.getByText("Mexico")).toBeTruthy()
    })

    it("renders table headers", () => {
        render(
            <MemoryRouter>
                <NationList />
            </MemoryRouter>
        )
        expect(screen.getAllByText("Nation Name").length).toBeGreaterThan(0)
        expect(screen.getAllByText("Nation Code").length).toBeGreaterThan(0)
    })

    it("renders delete buttons for each row", () => {
        render(
            <MemoryRouter>
                <NationList />
            </MemoryRouter>
        )
        const deleteButtons = screen.getAllByText("Delete")
        expect(deleteButtons.length).toBe(3)
    })

    it("renders edit buttons for each row", () => {
        render(
            <MemoryRouter>
                <NationList />
            </MemoryRouter>
        )
        const editButtons = screen.getAllByText("Edit")
        expect(editButtons.length).toBe(3)
    })

    it("shows confirm dialog when delete is clicked", () => {
        const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false)
        
        render(
            <MemoryRouter>
                <NationList />
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
                <NationList />
            </MemoryRouter>
        )
        
        const deleteButtons = screen.getAllByText("Delete")
        fireEvent.click(deleteButtons[0])
        
        await waitFor(() => {
            expect(api.default.delete).toHaveBeenCalledWith("/nations/1")
        })
    })
})
