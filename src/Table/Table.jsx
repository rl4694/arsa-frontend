import './Table.css'

function Table(props) {
    const renderRows = () => {
        return props.data.map(record => {
            return (
                <tr key={record._id}>
                    {props.cols.map(col => (
                        <td key={col.attribute}>{record[col.attribute]}</td>
                    ))}
                </tr>
            )
        })
    }

    return (
        <table>
            <thead>
                <tr className="header">
                    {props.cols.map(col => (
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