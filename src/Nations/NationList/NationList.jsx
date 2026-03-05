import { useState } from 'react'
import useRecord from "../../hooks/useRecord"
import Table from "../../components/Table/Table"
import CreateForm from "../../components/CreateForm/CreateForm"
import UpdateForm from '../../components/UpdateForm/UpdateForm'
import api from '../../api'

function NationList() {
    const [nations, setNations, refetch] = useRecord("/nations")
    const [showCreate, setShowCreate] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [success, setSuccess] = useState('')

    const fields = [
        { attribute: "name", display: "Nation Name", type: "text" },
        { attribute: "code", display: "Nation Code", type: "text" },
    ]

    const handleCreate = (created) => {
        setNations(prev => [...prev, created])
        setSuccess('Successfully Created')
    }

    const handleUpdate = (updated) => {
        setNations(prev => prev.map(n => n._id === updated._id ? updated : n))
        setSuccess('Successfully Updated')
    }

    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete "${record.name}"?`)) {
            return
        }
        try {
            await api.delete(`/nations/${record._id}`)
            refetch()
            setSuccess('Successfully Deleted')
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete')
        }
    }

    return (
        <div className="background">
            <div className="title">Nations</div>
            <button className="create-btn" onClick={() => setShowCreate(true)}>+ Create</button>
            {success && <p className="form-success">{success}</p>}
            <Table data={nations} cols={fields} onEdit={setSelectedRecord} onDelete={handleDelete} />
            {showCreate && (
                <CreateForm
                    title="Add New Nation"
                    fields={fields}
                    endpoint="/nations"
                    onClose={() => setShowCreate(false)}
                    onSuccess={handleCreate}
                />
            )}
            {selectedRecord && (
                <UpdateForm
                    record={selectedRecord}
                    fields={fields}
                    endpoint="/nations"
                    onClose={() => setSelectedRecord(null)}
                    onSuccess={handleUpdate}
                />
            )}
        </div>
    )
}

export default NationList