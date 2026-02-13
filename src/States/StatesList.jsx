import useRecord from "../hooks/useRecord"
import Table from "../Table/Table"

function StatesList() {
    const [states] = useRecord("/states")
    const cols = [
        { attribute: "name", display: "State Name" },
        { attribute: "nation_name", display: "Nation Name" },
    ]

    return (
        <div className="background">
            <div className="title">States</div>
            <Table data={states} cols={cols} />
        </div>
    )
}

export default StatesList