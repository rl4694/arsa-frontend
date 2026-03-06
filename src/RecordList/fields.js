export const cityFields = [
    { attribute: "name", display: "City Name", type: "text" },
    { attribute: "state_name", display: "State Name", type: "text" },
    { attribute: "nation_name", display: "Nation Name", type: "text" },
    { attribute: "latitude", display: "Latitude", type: "number" },
    { attribute: "longitude", display: "Longitude", type: "number" },
]

export const stateFields = [
    { attribute: "name", display: "State Name", type: "text" },
    { attribute: "nation_name", display: "Nation Name", type: "text" },
]

export const nationFields = [
    { attribute: "name", display: "Nation Name", type: "text" },
    { attribute: "code", display: "Nation Code", type: "text" },
]

export const disasterFields = [
    { attribute: "name", display: "Name", type: "text" },
    {
        attribute: "type",
        display: "Type",
        type: "select",
        options: ["earthquake", "tsunami", "landslide", "hurricane"],
    },
    { attribute: "date", display: "Date", type: "date" },
    { attribute: "latitude", display: "Latitude", type: "number" },
    { attribute: "longitude", display: "Longitude", type: "number" },
    { attribute: "description", display: "Description", type: "text" },
]
