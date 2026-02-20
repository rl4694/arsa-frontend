import useRecord from "../../hooks/useRecord"
import Table from "../../components/Table/Table"

function DisastersList() {
    const [disasters] = useRecord("/natural_disasters")
    const cols = [
        { attribute: "name", display: "Name" },
        { attribute: "type", display: "Type" },
        { attribute: "date", display: "Date" },
        { attribute: "location", display: "Coordinates" },
        { attribute: "description", display: "Description" },
    ]

    return (
        <div className="background">
            <div className="title">Disasters</div>
            <Table data={disasters} cols={cols} />
        </div>
    )
}

export default DisastersList