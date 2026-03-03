import { useState } from 'react'
import Table from "../../components/Table/Table"
import CreateForm from "../../components/CreateForm/CreateForm"
import UpdateForm from '../../components/UpdateForm/UpdateForm'
import useRecord from '../../hooks/useRecord'
import api from '../../api'

function CityList() {
    const [cities, setCities, refetch] = useRecord("/cities")
    const [showCreate, setShowCreate] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)

    const fields = [
        { attribute: "name", display: "City Name", type: "text" },
        { attribute: "state_name", display: "State Name", type: "text" },
        { attribute: "nation_name", display: "Nation Name", type: "text" },
        { attribute: "latitude", display: "Latitude", type: "number" },
        { attribute: "longitude", display: "Longitude", type: "number" },
    ]

    const handleCreate = (created) => {
        setCities(prev => [...prev, created])
    }

    const handleUpdate = (updated) => {
        setCities(prev => prev.map(c => c._id === updated._id ? updated : c))
    }

    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete "${record.name}"?`)) {
            return
        }
        try {
            await api.delete(`/cities/${record._id}`)
            refetch()
        } catch {
            console.log("Error deleting")
        }
    }

    return (
        <div className="background">
            <div className="title">Cities</div>
            <button className="create-btn" onClick={() => setShowCreate(true)}>+ Create</button>
            <Table data={cities} cols={fields} onEdit={setSelectedRecord} onDelete={handleDelete} />
            {showCreate && (
                <CreateForm
                    title="Add New City"
                    fields={fields}
                    endpoint="/cities"
                    onClose={() => setShowCreate(false)}
                    onSuccess={handleCreate}
                />
            )}
            {selectedRecord && (
                <UpdateForm
                    record={selectedRecord}
                    fields={fields}
                    endpoint="/cities"
                    onClose={() => setSelectedRecord(null)}
                    onSuccess={handleUpdate}
                />
            )}
        </div>
    )
}

export default CityList