import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import UpdateForm from "./UpdateForm";

const sampleFields = [
    { attribute: "first", display: "First", type: "text" },
    { attribute: "second", display: "Second", type: "text" },
    { attribute: "third", display: "Third", type: "text" },
]

const sampleRecord = { _id: "1", first: "One", second: "Two", third: "Three" }

vi.mock("../../api", () => ({
    default: {
        put: vi.fn(),
    },
}))

describe('UpdateForm', () => {
    it('matches snapshot', () => {
        const { container } = render(
            <UpdateForm
                record={sampleRecord}
                fields={sampleFields}
                endpoint="test" />
        )
        expect(container).toMatchSnapshot();
    })
})