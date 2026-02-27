import { useState } from 'react'
import useRecord from "../../hooks/useRecord"
import Table from "../../components/Table/Table"
import CreateForm from "../../components/CreateForm/CreateForm"
import UpdateForm from '../../components/UpdateForm/UpdateForm'
import api from '../../api'

function StatesList() {
    const [states, setStates, refetch] = useRecord("/states")
    const [showCreate, setShowCreate] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)

    const fields = [
        { attribute: "name", display: "State Name", type: "text" },
        { attribute: "nation_name", display: "Nation Name", type: "text" },
    ]

    const handleUpdate = (updated) => {
        setStates(prev => prev.map(s => s._id === updated._id ? updated : s))
    }

    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete "${record.name}"?`)) {
            return
        }
        try {
            await api.delete(`/states/${record._id}`)
            refetch()
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete')
        }
    }

    return (
        <div className="background">
            <div className="title">States</div>
            <button className="create-btn" onClick={() => setShowCreate(true)}>+ Create</button>
            <Table data={states} cols={fields} onEdit={setSelectedRecord} onDelete={handleDelete} />
            {showCreate && (
                <CreateForm
                    title="Add New State"
                    fields={fields}
                    endpoint="/states"
                    onClose={() => setShowCreate(false)}
                    onSuccess={refetch}
                />
            )}
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