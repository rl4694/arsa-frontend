import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Table from "./Table";

const sampleCols = [
    { attribute: "first", display: "First", type: "text" },
    { attribute: "second", display: "Second", type: "text" },
    { attribute: "third", display: "Third", type: "text" },
]

const sampleData = [
    { _id: "1", first: "One", second: "Two", third: "Three" },
    { _id: "2", first: "Four", second: "Five", third: "Six" },
]

const deleteMock = vi.fn()
const editMock = vi.fn()

let container

beforeEach(() => {
    const result = render(
        <Table
            cols={sampleCols}
            data={sampleData}
            onDelete={deleteMock}
            onEdit={editMock}
        />
    )
    container = result.container
})

describe('Table', () => {
    it('matches snapshot', () => {
        expect(container).toMatchSnapshot();
    })

    it("renders table headers", () => {
        expect(screen.getAllByText("First")).toBeTruthy()
        expect(screen.getAllByText("Second")).toBeTruthy()
        expect(screen.getAllByText("Third")).toBeTruthy()
    })

    it("renders sample data in the table", () => {
        expect(screen.getByText("One")).toBeTruthy()
        expect(screen.getByText("Two")).toBeTruthy()
        expect(screen.getByText("Three")).toBeTruthy()
    })

    it("renders buttons on hover", async () => {
        const user = userEvent.setup()
        const dataRow = screen.getAllByRole("row")[1]
        await user.hover(dataRow)

        const buttons = within(dataRow).getAllByRole("button")
        expect(buttons.length).toBe(2)
    })
})