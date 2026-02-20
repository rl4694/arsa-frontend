import useRecord from "../../hooks/useRecord"
import Table from "../../components/Table/Table"

function NationList() {
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

export default NationList