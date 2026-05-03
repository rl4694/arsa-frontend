import { Link, useNavigate } from "react-router-dom"
import "./Navbar.css"
import { useState } from "react"
import { useAuth } from "../../Auth/AuthProvider/useAuth"

function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const renderDropdown = () => {
        if (!dropdownOpen) {
            return
        }
        return (
            <div className="dropdown-list">
                <Link to="/cities" className="item">Cities</Link>
                <Link to="/states" className="item">States</Link>
                <Link to="/nations" className="item">Nations</Link>
                <Link to="/disasters" className="item">Disasters</Link>
            </div>
        )
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="navbar">
            <div className="left">
                <Link to="/" className="item">Arsa</Link>
                <div
                    className="item dropdown"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    Data
                    <span className="down-caret">&#9660;</span>
                    {renderDropdown()}
                </div>
                <Link to="/stats" className="item">Stats</Link>
            </div>
            <div className="right">
                {user ? (
                    <>
                        <span className="item navbar-username">{user.name}</span>
                        <button className="item navbar-logout" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="item">Login</Link>
                        <Link to="/register" className="item">Sign Up</Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default Navbar