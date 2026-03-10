import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Table from "../components/Table/Table"
import UpsertForm from '../components/UpsertForm/UpsertForm'
import api from '../api'
import { useAuth } from '../Auth/AuthProvider/useAuth'
import "./RecordList.css";

function RecordList({ title, api_path, fields }) {
    const [records, setRecords] = useState([])
    const [showCreate, setShowCreate] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth()
    const isLoggedIn = Boolean(user || localStorage.getItem('token'))

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

    const handleCreate = async (formData) => {
        const res = await api.post(api_path, formData)
        const created = res.data.records
        setRecords(prev => [...prev, created])
        setSuccess('Successfully Created')
    }

    const handleUpdate = async (formData, record) => {
        const res = await api.put(`${api_path}/${record._id}`, formData)
        const updated = res.data.records
        setRecords(prev => prev.map(r => r._id === updated._id ? updated : r))
        setSuccess('Successfully Updated')
    }

    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete "${record.name}"?`)) {
            return
        }
        try {
            await api.delete(`${api_path}/${record._id}`)
            setRecords(prev => prev.filter(r => r._id !== record._id))
            setSuccess('Successfully Deleted')
        } catch {
            console.log("Error deleting")
        }
    }

    const handleOpenCreate = () => {
        if (!isLoggedIn) {
            navigate('/login', { state: { from: location.pathname } })
            return
        }
        setShowCreate(true)
    }

    return (
        <div className="background">
            <div className="title">{title}</div>
            <button className="create-btn" onClick={handleOpenCreate}>+ Create</button>
            {success && <p className="form-success">{success}</p>}
            <Table data={records} cols={fields} onEdit={setSelectedRecord} onDelete={handleDelete} />
            {showCreate && (
                <UpsertForm
                    title={`Add New ${title}`}
                    fields={fields}
                    onSubmit={handleCreate}
                    onClose={() => setShowCreate(false)}
                />
            )}
            {selectedRecord && (
                <UpsertForm
                    title={`Edit`}
                    record={selectedRecord}
                    fields={fields}
                    onSubmit={handleUpdate}
                    onClose={() => setSelectedRecord(null)}
                />
            )}
        </div>
    )
}

export default RecordList