import { useState, useEffect } from 'react'
import Table from "../components/Table/Table"
import UpsertForm from '../components/UpsertForm/UpsertForm'
import api from '../api'
import { useAuth } from '../Auth/AuthProvider/useAuth'
import { useRecords } from '../hooks/useRecords'
import "./RecordList.css";

function RecordList({ title, api_path }) {
    const [records, refetch] = useRecords(api_path)
    const [fields, setFields] = useState([])
    const [showCreate, setShowCreate] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const auth = useAuth() || {}
    const { user } = auth
    const isLoggedIn = Boolean(user)

    // Run fetchRecords on load
    useEffect(() => {
        api.get(`${api_path}/fields`)
            .then(res => setFields(res.data))
            .catch(err => setError(err.response?.data?.error || 'Failed to load fields'))
    }, [api_path])

    const clearMessages = () => {
        setSuccess('')
        setError('')
    }

    const getAuthHeader = () => {
        const token = localStorage.getItem('token')
        return token ? { Authorization: `Bearer ${token}` } : {}
    }

    const handleCreate = async (formData) => {
        clearMessages()
        await api.post(api_path, formData, { headers: getAuthHeader() })
        refetch()
        setSuccess('Successfully Created')
    }

    const handleUpdate = async (formData, record) => {
        clearMessages()
        await api.put(`${api_path}/${record._id}`, formData, { headers: getAuthHeader() })
        refetch()
        setSuccess('Successfully Updated')
    }

    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete "${record.name}"?`)) {
            return
        }
        clearMessages()
        try {
            await api.delete(`${api_path}/${record._id}`, { headers: getAuthHeader() })
            refetch()
            setSuccess('Successfully Deleted')
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete record')
        }
    }

    return (
        <div className="background">
            <div className="title">{title}</div>
            {isLoggedIn && <button className="create-btn" onClick={() => setShowCreate(true)}>+ Create</button>}
            {success && <p className="form-success">{success}</p>}
            {error && <p className="form-error">{error}</p>}
            <Table data={records} cols={fields} onEdit={setSelectedRecord} onDelete={handleDelete} isLoggedIn={isLoggedIn} />
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