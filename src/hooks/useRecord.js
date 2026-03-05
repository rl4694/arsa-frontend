import { useEffect, useState, useCallback } from "react"
import api from "../api"


function useRecord(api_path) {
    const [record, setRecord] = useState([])

    // Re-render fetchRecords if api_path changes
    const fetchRecords = useCallback(() => {
        api.get(api_path).then(res => {
            if (!res.data.records) {
                return
            }
            setRecord(Object.values(res.data.records))
        })
    }, [api_path])

    // Re-run fetchRecords if it is re-rendered
    useEffect(() => {
        fetchRecords()
    }, [fetchRecords])

    return [record, setRecord, fetchRecords]
}

export default useRecord