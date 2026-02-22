import useRecord from "../../hooks/useRecord"
import Table from "../../components/Table/Table"
import CreateForm from "../../components/CreateForm/CreateForm"

function DisastersList() {
    const [disasters, , refetch] = useRecord("/natural_disasters")
    const cols = [
        { attribute: "name", display: "Name" },
        { attribute: "type", display: "Type" },
        { attribute: "date", display: "Date" },
        { attribute: "location", display: "Coordinates" },
        { attribute: "description", display: "Description" },
    ]

    const formFields = [
        { name: "name", label: "Name", placeholder: "Enter disaster name" },
        { name: "type", label: "Type", placeholder: "e.g. Earthquake, Flood" },
        { name: "date", label: "Date", type: "date" },
        { name: "location", label: "Coordinates", placeholder: "e.g. 40.7,-74.0" },
        { name: "description", label: "Description", placeholder: "Brief description" },
    ]

    return (
        <div className="background">
            <div className="title">Disasters</div>
            <CreateForm
                title="Add New Disaster"
                fields={formFields}
                endpoint="/natural_disasters"
                onSuccess={refetch}
            />
            <Table data={disasters} cols={cols} />
        </div>
    )
}

export default DisastersList