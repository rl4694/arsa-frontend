import { useEffect, useState } from "react"
import api from "../api"


function useRecord(api_path) {
    const [record, setRecord] = useState([])

    useEffect(() => {
        api.get(api_path).then(res => {
            if (!res.data.records) {
                return
            }
            setRecord(Object.values(res.data.records))
        })
    }, [])

    return [record, setRecord]
}

export default useRecord