import useRecord from "../hooks/useRecord"
import Table from "../Table/Table"

function NationsList() {
    const [nations] = useRecord("/nations")
    const cols = [
        { attribute: "name", display: "Nation Name" },
        { attribute: "code", display: "Nation Code" },
    ]

    return (
        <div className="background">
            <div className="title">Nations</div>
            <Table data={nations} cols={cols} />
        </div>
    )
}

export default NationsList