import useRecord from "../../hooks/useRecord"
import Table from "../../components/Table/Table"
import CreateForm from "../../components/CreateForm/CreateForm"

function NationList() {
    const [nations, , refetch] = useRecord("/nations")
    const cols = [
        { attribute: "name", display: "Nation Name" },
        { attribute: "code", display: "Nation Code" },
    ]

    const formFields = [
        { name: "name", label: "Nation Name", placeholder: "Enter nation name" },
        { name: "code", label: "Nation Code", placeholder: "Enter nation code (e.g. US)" },
    ]

    return (
        <div className="background">
            <div className="title">Nations</div>
            <CreateForm
                title="Add New Nation"
                fields={formFields}
                endpoint="/nations"
                onSuccess={refetch}
            />
            <Table data={nations} cols={cols} />
        </div>
    )
}

export default NationList