import { useState } from 'react'
import Table from "../../components/Table/Table"
import CreateForm from "../../components/CreateForm/CreateForm"
import UpdateForm from '../../components/UpdateForm/UpdateForm'
import useRecord from '../../hooks/useRecord'
import api from '../../api'

const sampleData = [
    { _id: "1", name: "New York", state_name: "New York", nation_name: "USA", latitude: 40.7, longitude: -74.0 },
    { _id: "2", name: "Los Angeles", state_name: "California", nation_name: "USA", latitude: 34.0, longitude: -118.2 },
    { _id: "3", name: "Chicago", state_name: "Illinois", nation_name: "USA", latitude: 41.9, longitude: -87.6 },
]

function CityList() {
    const [apiCities, _, refetch] = useRecord("/cities")
    const [showCreate, setShowCreate] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [localCities, setLocalCities] = useState(sampleData)
    
    const cities = apiCities.length > 0 ? apiCities : localCities

    const fields = [
        { attribute: "name", display: "City Name", type: "text" },
        { attribute: "state_name", display: "State Name", type: "text" },
        { attribute: "nation_name", display: "Nation Name", type: "text" },
        { attribute: "latitude", display: "Latitude", type: "number" },
        { attribute: "longitude", display: "Longitude", type: "number" },
    ]

    const handleUpdate = (updated) => {
        setLocalCities(prev => prev.map(c => c._id === updated._id ? updated : c))
    }

    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete "${record.name}"?`)) {
            return
        }
        try {
            await api.delete(`/cities/${record._id}`)
            refetch()
        } catch {
            setLocalCities(prev => prev.filter(c => c._id !== record._id))
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
                    onSuccess={refetch}
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