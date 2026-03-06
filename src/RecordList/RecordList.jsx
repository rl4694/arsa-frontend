import { useState, useEffect, useCallback } from 'react'
import Table from "../components/Table/Table"
import CreateForm from "../components/CreateForm/CreateForm"
import UpdateForm from '../components/UpdateForm/UpdateForm'
import api from '../api'
import "./RecordList.css";

function RecordList({ title, api_path, fields }) {
    const [records, setRecords] = useState([])
    const [showCreate, setShowCreate] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [success, setSuccess] = useState('')

    // Prevent fetchRecords from being re-rendered except if api_path changes
    const fetchRecords = useCallback(() => {
        api.get(api_path).then(res => {
            if (!res.data.records) {
                return
            }
            setRecords(Object.values(res.data.records))
        })
    }, [api_path])

    // Run fetchRecords on load
    useEffect(() => {
        fetchRecords()
    }, [fetchRecords])

    const handleCreate = (created) => {
        setRecords(prev => [...prev, created])
        setSuccess('Successfully Created')
    }

    const handleUpdate = (updated) => {
        setRecords(prev => prev.map(c => c._id === updated._id ? updated : c))
        setSuccess('Successfully Updated')
    }

    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete "${record.name}"?`)) {
            return
        }
        try {
            await api.delete(`${api_path}/${record._id}`)
            fetchRecords()
            setSuccess('Successfully Deleted')
        } catch {
            console.log("Error deleting")
        }
    }

    return (
        <div className="background">
            <div className="title">{title}</div>
            <button className="create-btn" onClick={() => setShowCreate(true)}>+ Create</button>
            {success && <p className="form-success">{success}</p>}
            <Table data={records} cols={fields} onEdit={setSelectedRecord} onDelete={handleDelete} />
            {showCreate && (
                <CreateForm
                    title="Add New City"
                    fields={fields}
                    endpoint={api_path}
                    onClose={() => setShowCreate(false)}
                    onSuccess={handleCreate}
                />
            )}
            {selectedRecord && (
                <UpdateForm
                    record={selectedRecord}
                    fields={fields}
                    endpoint={api_path}
                    onClose={() => setSelectedRecord(null)}
                    onSuccess={handleUpdate}
                />
            )}
        </div>
    )
}

export default RecordList