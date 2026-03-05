import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import DisastersList from "./DisasterList";

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
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders the title", () => {
        render(
            <MemoryRouter>
                <DisastersList />
            </MemoryRouter>
        )
        expect(screen.getByText("Disasters")).toBeTruthy()
    })

    it("renders the create form", () => {
        render(
            <MemoryRouter>
                <DisastersList />
            </MemoryRouter>
        )
        expect(screen.getByText("Add New Disaster")).toBeTruthy()
    })

    it("renders sample data in the table", () => {
        render(
            <MemoryRouter>
                <DisastersList />
            </MemoryRouter>
        )
        expect(screen.getByText("Hurricane Katrina")).toBeTruthy()
        expect(screen.getByText("Tohoku Earthquake")).toBeTruthy()
        expect(screen.getByText("Indian Ocean Tsunami")).toBeTruthy()
    })

    it("renders table headers", () => {
        render(
            <MemoryRouter>
                <DisastersList />
            </MemoryRouter>
        )
        expect(screen.getAllByText("Name").length).toBeGreaterThan(0)
        expect(screen.getAllByText("Type").length).toBeGreaterThan(0)
        expect(screen.getAllByText("Date").length).toBeGreaterThan(0)
        expect(screen.getAllByText("Coordinates").length).toBeGreaterThan(0)
    })

    it("renders delete buttons for each row", () => {
        render(
            <MemoryRouter>
                <DisastersList />
            </MemoryRouter>
        )
        const deleteButtons = screen.getAllByText("Delete")
        expect(deleteButtons.length).toBe(3)
    })

    it("renders edit buttons for each row", () => {
        render(
            <MemoryRouter>
                <DisastersList />
            </MemoryRouter>
        )
        const editButtons = screen.getAllByText("Edit")
        expect(editButtons.length).toBe(3)
    })

    it("shows confirm dialog when delete is clicked", () => {
        const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false)
        
        render(
            <MemoryRouter>
                <DisastersList />
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
                <DisastersList />
            </MemoryRouter>
        )
        
        const deleteButtons = screen.getAllByText("Delete")
        fireEvent.click(deleteButtons[0])
        
        await waitFor(() => {
            expect(api.default.delete).toHaveBeenCalledWith("/natural_disasters/1")
        })
    })
})
