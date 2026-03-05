import { useState } from 'react'
import api from '../../api'
import './UpdateForm.css'

function UpdateForm({ record, fields, endpoint, onClose, onSuccess }) {
    const [formData, setFormData] = useState(() => {
        const initial = {}
        fields.forEach(f => { initial[f.attribute] = record[f.attribute] ?? '' })
        return initial
    })
    const [error, setError] = useState('')

    const handleChange = (field, value) => {
        if (field.type === 'number' && value.length > 0) {
            value = parseFloat(value)
        }
        setFormData(prev => ({ ...prev, [field.attribute]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const res = await api.put(`${endpoint}/${record._id}`, formData)
            onSuccess(res.data.records)
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed')
        }
    }

    const renderInput = (field) => {
        if (field.type === 'select') {
            return (
                <select
                    value={formData[field.attribute]}
                    onChange={e => handleChange(field, e.target.value)}
                >
                    {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            )
        }
        return (
            <input
                type={field.type || 'text'}
                value={formData[field.attribute]}
                onChange={e => handleChange(field, e.target.value)}
            />
        )
    }

    return (
        <div className="update-form-overlay" onClick={onClose}>
            <form
                className="update-form"
                onSubmit={handleSubmit}
                onClick={e => e.stopPropagation()}
            >
                <h2>Edit</h2>
                {error && <p className="update-form-error">{error}</p>}
                {fields.map(field => (
                    <div key={field.attribute} className="update-form-field">
                        <label>{field.display}</label>
                        {renderInput(field)}
                    </div>
                ))}
                <div className="update-form-actions">
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateForm
