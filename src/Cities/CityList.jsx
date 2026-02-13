import Table from "../Table/Table"
import useRecord from '../hooks/useRecord'

function CityList() {
    const [cities] = useRecord("/cities")
    const cols = [
        { attribute: "name", display: "City Name" },
        { attribute: "state_name", display: "State Name" },
        { attribute: "nation_name", display: "Nation Name" },
    ]

    return (
        <div className="background">
            <div className="title">Cities</div>
            <Table data={cities} cols={cols} />
        </div>
    )
}

export default CityList