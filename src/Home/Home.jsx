import { Link } from "react-router-dom"

function Home() {
    return (
        <div>
            Home
            <br />
            <Link to="/cities">Cities</Link>
        </div>
    )
}

export default Home