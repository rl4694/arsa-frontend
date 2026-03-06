import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Navbar from "./Navbar";
import { AuthContext } from "../../Auth/AuthProvider/useAuth";

describe('Navbar', () => {
    it('matches snapshot', () => {
        const mockAuth = {
            user: { name: 'test' },
            logout: vi.fn(),
            login: vi.fn()
        }

        const { container } = render(
            <MemoryRouter>
                <AuthContext.Provider value={mockAuth}>
                    <Navbar />
                </AuthContext.Provider>
            </MemoryRouter>
        )
        expect(container).toMatchSnapshot();
    })
})