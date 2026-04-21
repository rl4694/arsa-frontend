import { useMemo, useState } from 'react'
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import './Table.css'

function Table({ data, cols, onDelete, onEdit, isLoggedIn }) {
    const [active, setActive] = useState("")
    const [sortConfig, setSortConfig] = useState({ attribute: "", direction: "asc" })

    const getComparableValue = (value, type) => {
        if (value == null) return null

        if (type === 'number') {
            const num = Number(value)
            return Number.isNaN(num) ? null : num
        }

        if (type === 'date') {
            const timestamp = Date.parse(value)
            return Number.isNaN(timestamp) ? String(value).toLowerCase() : timestamp
        }

        return String(value).toLowerCase()
    }

    const sortedData = useMemo(() => {
        if (!sortConfig.attribute) {
            return data
        }

        const col = cols.find((c) => c.attribute === sortConfig.attribute)
        const directionFactor = sortConfig.direction === 'asc' ? 1 : -1

        return [...data].sort((a, b) => {
            const aVal = getComparableValue(a?.[sortConfig.attribute], col?.type)
            const bVal = getComparableValue(b?.[sortConfig.attribute], col?.type)

            if (aVal == null && bVal == null) return 0
            if (aVal == null) return 1
            if (bVal == null) return -1
            if (aVal < bVal) return -1 * directionFactor
            if (aVal > bVal) return 1 * directionFactor
            return 0
        })
    }, [data, cols, sortConfig])

    const toggleSort = (attribute) => {
        setSortConfig((prev) => {
            if (prev.attribute === attribute) {
                return {
                    attribute,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc',
                }
            }

            return {
                attribute,
                direction: 'asc',
            }
        })
    }

    const renderRows = () => {
        return sortedData.map(record => {
            const showActions = isLoggedIn && active == record._id

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
                    {cols.map(col => {
                        const isSorted = sortConfig.attribute === col.attribute
                        const ariaSort = isSorted
                            ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending')
                            : 'none'
                        const sortIcon = isSorted
                            ? (sortConfig.direction === 'asc' ? ' \u2191' : ' \u2193')
                            : ''

                        return (
                            <th key={col.attribute} scope="col" aria-sort={ariaSort}>
                                <button
                                    type="button"
                                    className="sort-btn"
                                    onClick={() => toggleSort(col.attribute)}
                                    aria-label={`Sort by ${col.display}`}
                                >
                                    {col.display}{sortIcon}
                                </button>
                            </th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {renderRows()}
            </tbody>
        </table>
    )
}

export default Table