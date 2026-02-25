import { useState } from 'react'
import useRecord from "../../hooks/useRecord"
import Table from "../../components/Table/Table"
import CreateForm from "../../components/CreateForm/CreateForm"
import UpdateForm from '../../UpdateForm/UpdateForm'

function DisastersList() {
    const [disasters, setDisasters, refetch] = useRecord("/natural_disasters")
    const [selectedRecord, setSelectedRecord] = useState(null)

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

    const fields = [
        { attribute: "name", display: "Name", type: "text" },
        {
            attribute: "type",
            display: "Type",
            type: "select",
            options: ["earthquake", "tsunami", "landslide", "hurricane"],
        },
        { attribute: "date", display: "Date", type: "date" },
        { attribute: "location", display: "Coordinates", type: "text" },
        { attribute: "description", display: "Description", type: "text" },
    ]

    const handleUpdate = (updated) => {
        setDisasters(prev => prev.map(d => d._id === updated._id ? updated : d))
    }

    return (
        <div className="background">
            <div className="title">Disasters</div>
            <CreateForm
                title="Add New Disaster"
                fields={formFields}
                endpoint="/natural_disasters"
                onSuccess={refetch}
            />
            <Table data={disasters} cols={cols} onEdit={setSelectedRecord} />
            {selectedRecord && (
                <UpdateForm
                    record={selectedRecord}
                    fields={fields}
                    endpoint="/natural_disasters"
                    onClose={() => setSelectedRecord(null)}
                    onSuccess={handleUpdate}
                />
            )}
        </div>
    )
}

export default DisastersList