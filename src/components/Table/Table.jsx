import { useState } from 'react'
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import './Table.css'

function Table({ data, cols, onDelete, onEdit }) {
    const [active, setActive] = useState("")

    const renderRows = () => {
        return data.map(record => {
            const showActions = active == record._id

            return (
                <tr
                    key={record._id}
                    onMouseEnter={() => setActive(record._id)}
                    onMouseLeave={() => setActive("")}
                >
                    {cols.map(col => (
                        <td key={col.attribute}>{record[col.attribute]}</td>
                    ))}
                    
                    <td className="actions-cell">
                        {showActions && (
                            <div className="actions">
                                <button className="edit-btn" onClick={() => onEdit(record)} aria-label="edit">
                                    <FaPencilAlt />
                                </button>
                                <button className="delete-btn" onClick={() => onDelete(record)} aria-label="delete">
                                    <FaTrash />
                                </button>
                            </div>
                        )}
                    </td>
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
                </tr>
            </thead>
            <tbody>
                {renderRows()}
            </tbody>
        </table>
    )
}

export default Table