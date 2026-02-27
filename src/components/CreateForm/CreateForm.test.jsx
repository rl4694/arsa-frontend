import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CreateForm from "./CreateForm";

const sampleFields = [
    { attribute: "first", display: "First", type: "text" },
    { attribute: "second", display: "Second", type: "text" },
    { attribute: "third", display: "Third", type: "text" },
]

vi.mock("../../api", () => ({
    default: {
        post: vi.fn(),
    },
}))

describe('CreateForm', () => {
    it('matches snapshot', () => {
        const { container } = render(
            <CreateForm
                title="Test"
                fields={sampleFields}
                endpoint="test" />
        )
        expect(container).toMatchSnapshot();
    })
})