import { Link } from "react-router-dom"
import "./Navbar.css"
import { useState } from "react"

function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false)

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
            </div>
            <div className="right">
                <Link to="/login" className="item">Login</Link>
                <Link to="/register" className="item">Sign Up</Link>
            </div>
        </div>
    )
}

export default Navbar