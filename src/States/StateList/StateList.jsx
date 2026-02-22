import useRecord from "../../hooks/useRecord"
import Table from "../../components/Table/Table"
import CreateForm from "../../components/CreateForm/CreateForm"

function StatesList() {
    const [states, , refetch] = useRecord("/states")
    const cols = [
        { attribute: "name", display: "State Name" },
        { attribute: "nation_name", display: "Nation Name" },
    ]

    const formFields = [
        { name: "name", label: "State Name", placeholder: "Enter state name" },
        { name: "nation_id", label: "Nation ID", placeholder: "Enter nation ID" },
    ]

    return (
        <div className="background">
            <div className="title">States</div>
            <CreateForm
                title="Add New State"
                fields={formFields}
                endpoint="/states"
                onSuccess={refetch}
            />
            <Table data={states} cols={cols} />
        </div>
    )
}

export default StatesList