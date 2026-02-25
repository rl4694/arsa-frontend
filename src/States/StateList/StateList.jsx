import { useState } from 'react'
import useRecord from "../../hooks/useRecord"
import Table from "../../components/Table/Table"
import CreateForm from "../../components/CreateForm/CreateForm"
import UpdateForm from '../../UpdateForm/UpdateForm'

function StatesList() {
    const [states, setStates, refetch] = useRecord("/states")
    const [selectedRecord, setSelectedRecord] = useState(null)

    const cols = [
        { attribute: "name", display: "State Name" },
        { attribute: "nation_name", display: "Nation Name" },
    ]

    const formFields = [
        { name: "name", label: "State Name", placeholder: "Enter state name" },
        { name: "nation_id", label: "Nation ID", placeholder: "Enter nation ID" },
    ]

    const fields = [
        { attribute: "name", display: "State Name", type: "text" },
        { attribute: "nation_name", display: "Nation Name", type: "text" },
    ]

    const handleUpdate = (updated) => {
        setStates(prev => prev.map(s => s._id === updated._id ? updated : s))
    }

    return (
        <div className="background">
            <div className="title">States</div>
            <CreateForm
                title="Add New State"
                fields={formFields}
                endpoint="/states"
                onSuccess={refetch}
            />
            <Table data={states} cols={cols} onEdit={setSelectedRecord} />
            {selectedRecord && (
                <UpdateForm
                    record={selectedRecord}
                    fields={fields}
                    endpoint="/states"
                    onClose={() => setSelectedRecord(null)}
                    onSuccess={handleUpdate}
                />
            )}
        </div>
    )
}

export default StatesList