import Table from "../../components/Table/Table"
import CreateForm from "../../components/CreateForm/CreateForm"
import useRecord from '../../hooks/useRecord'

function CityList() {
    const [cities, , refetch] = useRecord("/cities")
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

    return (
        <div className="background">
            <div className="title">Cities</div>
            <CreateForm
                title="Add New City"
                fields={formFields}
                endpoint="/cities"
                onSuccess={refetch}
            />
            <Table data={cities} cols={cols} />
        </div>
    )
}

export default CityList