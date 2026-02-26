import { useState } from 'react'
import useRecord from "../../hooks/useRecord"
import Table from "../../components/Table/Table"
import CreateForm from "../../components/CreateForm/CreateForm"
import UpdateForm from '../../UpdateForm/UpdateForm'
import api from '../../api'

function NationList() {
    const [nations, setNations, refetch] = useRecord("/nations")
    const [selectedRecord, setSelectedRecord] = useState(null)

    const cols = [
        { attribute: "name", display: "Nation Name" },
        { attribute: "code", display: "Nation Code" },
    ]

    const formFields = [
        { name: "name", label: "Nation Name", placeholder: "Enter nation name" },
        { name: "code", label: "Nation Code", placeholder: "Enter nation code (e.g. US)" },
    ]

    const fields = [
        { attribute: "name", display: "Nation Name", type: "text" },
        { attribute: "code", display: "Nation Code", type: "text" },
    ]

    const handleUpdate = (updated) => {
        setNations(prev => prev.map(n => n._id === updated._id ? updated : n))
    }

    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete "${record.name}"?`)) {
            return
        }
        try {
            await api.delete(`/nations/${record._id}`)
            refetch()
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete')
        }
    }

    return (
        <div className="background">
            <div className="title">Nations</div>
            <CreateForm
                title="Add New Nation"
                fields={formFields}
                endpoint="/nations"
                onSuccess={refetch}
            />
            <Table data={nations} cols={cols} onEdit={setSelectedRecord} onDelete={handleDelete} />
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