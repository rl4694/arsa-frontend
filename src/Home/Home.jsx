import { Link } from "react-router-dom"
import "./Home.css"

function Home() {
    return (
        <div className="container">
            Home
            <br />
            <Link to="/cities">Cities</Link>
        </div>
    )
}

export default Home