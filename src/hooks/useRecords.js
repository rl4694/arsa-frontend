import { useEffect, useState } from 'react'
import api from '../api'

// Columns that may include HTML
const htmlColumns = ["description"]

const stripHTML = (record) => {
    // Modifying copy of record in case record is immutable
    const cleaned = { ...record }
    htmlColumns.forEach(col => {
        if (Object.hasOwn(cleaned, col)) {
            // Remove any possible HTML tags in the format <...>
            cleaned[col] = cleaned[col].replace(/<[^>]*>/g, '')
        }
    })
    return cleaned
}

export function useRecords(api_path) {
    const [records, setRecords] = useState([])

    useEffect(() => {
        api.get(api_path)
            .then(res => {
                const data = Object.values(res?.data?.records || {})
                setRecords(data.map(stripHTML))
            })
            .catch(() => setRecords([]))
    }, [api_path])

    return [records, setRecords]
}