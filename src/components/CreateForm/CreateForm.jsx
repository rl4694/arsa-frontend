import { useState } from 'react'
import api from '../../api'
import './CreateForm.css'

function CreateForm({ title, fields, endpoint, onSuccess }) {
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

    return (
        <div className="create-form-container">
            <form onSubmit={handleSubmit} className="create-form">
                {title && <h2>{title}</h2>}
                
                {error && <p className="create-form-error">{error}</p>}
                {success && <p className="create-form-success">{success}</p>}

                {fields.map(field => (
                    <div key={field.attribute} className="create-form-field">
                        <label htmlFor={field.attribute}>{field.display}</label>
                        <input
                            id={field.attribute}
                            name={field.attribute}
                            type={field.type || 'text'}
                            placeholder={field.display}
                            value={formData[field.attribute]}
                            onChange={handleChange}
                            required={field.required !== false}
                        />
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
