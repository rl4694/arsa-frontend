import { useState, useEffect, useCallback } from 'react'
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
    const [error, setError] = useState('')
    const auth = useAuth() || {}
    const { user } = auth
    const isLoggedIn = Boolean(user)

    // Define useCallback functions that are used in useEffect and should not
    // be re-rendered unnecessarily
    const stripHTML = useCallback((record) => {
        const htmlColumns = ["description"]
        htmlColumns.forEach(col => {
            if (Object.hasOwn(record, col)) {
                // Remove any possible HTML tags in the format <...>
                record[col] = record[col].replace(/<[^>]*>/g, '')
            }
        })
        return record
    }, [])

    const fetchRecords = useCallback(() => {
        api.get(api_path)
            .then(res => {
                if (!res.data.records) {
                    return
                }
                setRecords(Object.values(res.data.records).map(stripHTML))
            })
            .catch(err => {
                setError(err.response?.data?.error || 'Failed to load records')
            })
    }, [api_path, stripHTML])

    // Run fetchRecords on load
    useEffect(() => {
        fetchRecords()
    }, [fetchRecords])

    const clearMessages = () => {
        setSuccess('')
        setError('')
    }

    const handleCreate = async (formData) => {
        clearMessages()
        const res = await api.post(api_path, formData)
        const created = res.data.records
        setRecords(prev => [...prev, created])
        setSuccess('Successfully Created')
    }

    const handleUpdate = async (formData, record) => {
        clearMessages()
        const res = await api.put(`${api_path}/${record._id}`, formData)
        const updated = res.data.records
        setRecords(prev => prev.map(r => r._id === updated._id ? updated : r))
        setSuccess('Successfully Updated')
    }

    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete "${record.name}"?`)) {
            return
        }
        clearMessages()
        try {
            await api.delete(`${api_path}/${record._id}`)
            setRecords(prev => prev.filter(r => r._id !== record._id))
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