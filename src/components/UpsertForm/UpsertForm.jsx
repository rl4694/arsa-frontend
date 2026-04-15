import { useState } from 'react'
import './UpsertForm.css'
import '../../form.css'

function UpsertForm({ title, record, fields, onSubmit, onClose }) {
    const initializeFormData = () => {
        const data = {}
        fields.forEach(field => {
            // Field value defaults to empty string
            let value = ''
            // If attribute exists in record, use it
            if (record && record[field.attribute]) {
                value = record[field.attribute]
            }
            // If field type is select, use the first option
            else if (field.type == 'select' && field.options?.length > 0) {
                value = field.options[0]
            }
            data[field.attribute] = value
        })
        return data
    }

    const [formData, setFormData] = useState(() => initializeFormData())
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (field, value) => {
        if (field.type === 'number' && value.length > 0) {
            value = parseFloat(value)
        }
        setFormData(prev => ({ ...prev, [field.attribute]: value }))
    }

    const handleSubmit = async (e) => {
        // Stop browser from reloading page
        e.preventDefault()

        // Update state variables
        setError('')
        setLoading(true)

        try {
            // Submit form
            await onSubmit(formData, record)
            // Close and clear form
            onClose()
            setFormData(initializeFormData())
        } catch (err) {
            // Show error message
            const message = err.response?.data?.error
            setError(message ? `Error: ${message}` : 'Failed to save')
        } finally {
            setLoading(false)
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
        <div className="upsert-form-overlay" onClick={onClose}>
            <form
                className="form-card"
                onSubmit={handleSubmit}
                onClick={e => e.stopPropagation()}
            >
                {title && <h2>{title}</h2>}

                {error && <p className="form-card-error">{error}</p>}

                {fields.map(field => (
                    <div key={field.attribute} className="form-field">
                        <label htmlFor={field.attribute}>{field.display}</label>
                        {renderInput(field)}
                    </div>
                ))}
                <div className="form-actions">
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UpsertForm
