import React from 'react'

export default function BootStrapTable() {
    return (
        <table className="table" >
            <thead style={{ backgroundColor: 'gray', border: '1px solid black', position: 'sticky', top: '0' }}>
                <tr style={{ backgroundColor: 'gray', border: '1px solid black' }}>
                    <th scope="col" className='table-header' style={{ backgroundColor: 'gray', border: '1px solid black' }}>#</th>
                    {Array.from({ length: 17 }).map((_, index) => (
                        <th className='table-header' style={{ backgroundColor: 'gray', border: '1px solid black' }} key={index}>Table heading (unit)
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: 30 }).map((_, index) => (
                    <tr >
                        <td >
                            {index + 1}
                        </td>
                        {Array.from({ length: 17 }).map((_, index) => (
                            <td key={index}  >Table cell {index + 1}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
