import './Table.css'

function Table({ data, cols, onDelete }) {
    const handleDelete = (record) => {
        if (onDelete) {
            onDelete(record)
        }
    }

    const renderRows = () => {
        return data.map(record => {
            return (
                <tr key={record._id}>
                    {cols.map(col => (
                        <td key={col.attribute}>{record[col.attribute]}</td>
                    ))}
                    {onDelete && (
                        <td className="actions-cell">
                            <button 
                                className="delete-btn"
                                onClick={() => handleDelete(record)}
                            >
                                Delete
                            </button>
                        </td>
                    )}
                </tr>
            )
        })
    }

    return (
        <table>
            <thead>
                <tr className="header">
                    {cols.map(col => (
                        <td key={col.attribute}>{col.display}</td>
                    ))}
                    {onDelete && <td>Actions</td>}
                </tr>
            </thead>
            <tbody>
                {renderRows()}
            </tbody>
        </table>
    )
}

export default Table