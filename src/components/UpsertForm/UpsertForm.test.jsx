import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import UpsertForm from "./UpsertForm";

const sampleFields = [
    { attribute: "first", display: "First", type: "text" },
    { attribute: "second", display: "Second", type: "text" },
    { attribute: "third", display: "Third", type: "text" },
]

const sampleRecord = { _id: "1", first: "One", second: "Two", third: "Three" }

vi.mock("../../api", () => ({
    default: {
        post: vi.fn(),
        put: vi.fn(),
    },
}))

describe('UpsertForm', () => {
    it('matches snapshot', () => {
        const { container } = render(
            <UpsertForm
                title="Test"
                record={sampleRecord}
                fields={sampleFields}
                onSubmit={vi.fn()}
                onClose={vi.fn()} />
        )
        expect(container).toMatchSnapshot();
    })
})