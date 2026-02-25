import './Table.css'

function Table({ data, cols, onDelete, onEdit }) {
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
                    {(onEdit || onDelete) && (
                        <td className="actions-cell">
                            {onEdit && (
                                <button onClick={() => onEdit(record)}>Edit</button>
                            )}
                            {onDelete && (
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(record)}
                                >
                                    Delete
                                </button>
                            )}
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
                    {(onEdit || onDelete) && <td>Actions</td>}
                </tr>
            </thead>
            <tbody>
                {renderRows()}
            </tbody>
        </table>
    )
}

export default Table