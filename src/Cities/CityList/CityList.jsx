import { useState } from 'react'
import Table from "../../components/Table/Table"
import CreateForm from "../../components/CreateForm/CreateForm"
import UpdateForm from '../../UpdateForm/UpdateForm'
import useRecord from '../../hooks/useRecord'

function CityList() {
    const [cities, setCities, refetch] = useRecord("/cities")
    const [selectedRecord, setSelectedRecord] = useState(null)

    const cols = [
        { attribute: "name", display: "City Name" },
        { attribute: "state_name", display: "State Name" },
        { attribute: "nation_name", display: "Nation Name" },
        { attribute: "latitude", display: "Latitude" },
        { attribute: "longitude", display: "Longitude" },
    ]

    const formFields = [
        { name: "name", label: "City Name", placeholder: "Enter city name" },
        { name: "state_id", label: "State ID", placeholder: "Enter state ID" },
    ]

    const fields = [
        { attribute: "name", display: "City Name", type: "text" },
        { attribute: "state_name", display: "State Name", type: "text" },
        { attribute: "nation_name", display: "Nation Name", type: "text" },
        { attribute: "latitude", display: "Latitude", type: "number" },
        { attribute: "longitude", display: "Longitude", type: "number" },
    ]

    const handleUpdate = (updated) => {
        setCities(prev => prev.map(c => c._id === updated._id ? updated : c))
    }

    return (
        <div className="background">
            <div className="title">Cities</div>
            <CreateForm
                title="Add New City"
                fields={formFields}
                endpoint="/cities"
                onSuccess={refetch}
            />
            <Table data={cities} cols={cols} onEdit={setSelectedRecord} />
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