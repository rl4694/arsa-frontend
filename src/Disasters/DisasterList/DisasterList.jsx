import { useState } from 'react'
import useRecord from "../../hooks/useRecord"
import Table from "../../components/Table/Table"
import CreateForm from "../../components/CreateForm/CreateForm"
import UpdateForm from '../../components/UpdateForm/UpdateForm'
import api from '../../api'

function DisastersList() {
    const [disasters, setDisasters, refetch] = useRecord("/natural_disasters")
    const [showCreate, setShowCreate] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)

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

    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete "${record.name}"?`)) {
            return
        }
        try {
            await api.delete(`/natural_disasters/${record._id}`)
            refetch()
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete')
        }
    }

    return (
        <div className="background">
            <div className="title">Disasters</div>
            <button className="create-btn" onClick={() => setShowCreate(true)}>+ Create</button>
            <Table data={disasters} cols={fields} onEdit={setSelectedRecord} onDelete={handleDelete} />
            {showCreate && (
                <CreateForm
                    title="Add New Disaster"
                    fields={fields}
                    endpoint="/natural_disasters"
                    onClose={() => setShowCreate(false)}
                    onSuccess={refetch}
                />
            )}
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