import { useState } from 'react'
import api from '../../api'
import './CreateForm.css'

function CreateForm({ title, fields, endpoint, onClose, onSuccess }) {
    const initialState = fields.reduce((acc, field) => {
        acc[field.name] = ''
        return acc
    }, {})

    const [formData, setFormData] = useState(initialState)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const response = await api.post(endpoint, formData)
            setSuccess('Created successfully!')
            setFormData(initialState)
            if (onSuccess) {
                onSuccess(response.data)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create')
        } finally {
            setLoading(false)
        }
    }

    const renderInput = (field) => {
        if (field.type === 'select') {
            return (
                <select
                    value={formData[field.attribute]}
                    onChange={e => handleChange(field.attribute, e.target.value)}
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
                onChange={e => handleChange(field.attribute, e.target.value)}
            />
        )
    }

    return (
        <div className="create-form-overlay" onClick={onClose}>
            <form
                className="create-form"
                onSubmit={handleSubmit}
                onClick={e => e.stopPropagation()}
            >
                {title && <h2>{title}</h2>}
                
                {error && <p className="create-form-error">{error}</p>}
                {success && <p className="create-form-success">{success}</p>}

                {fields.map(field => (
                    <div key={field.attribute} className="create-form-field">
                        <label htmlFor={field.attribute}>{field.display}</label>
                        {renderInput(field)}
                    </div>
                ))}

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </form>
        </div>
    )
}

export default CreateForm
