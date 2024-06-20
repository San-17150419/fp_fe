import Table from 'react-bootstrap/Table';

type DataTableProps = {
    children?: React.ReactNode
};

function DataTable() {
    return (

        <table className='table-auto relative'>
           
            <thead className='sticky top-0 bg-gray-400'>
                <tr>
                    <th className='border border-black sticky top-0'>#</th>
                    {Array.from({ length: 17 }).map((_, index) => (
                        <th className='text-center border border-black ' key={index}>Table heading (unit)
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className='overflow-scroll border border-black' >
                {Array.from({ length: 30 }).map((_, index) => (
                    <tr >
                        <td className='border border-gray-300 hover:bg-gray-500'>
                            {index + 1}
                        </td>
                        {Array.from({ length: 17 }).map((_, index) => (
                            <td key={index} className='border border-gray-300text-center hover:bg-gray-400'>Table cell {index + 1}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default DataTable;

type DataHeaderProps = {

};

function DataTableHeader() {
    return (
        <thead>
            <tr>
                <th>#</th>
                {Array.from({ length: 12 }).map((_, index) => (
                    <th className='text-center  text-primary' key={index}>Table heading</th>
                ))}
            </tr>
        </thead>
    );
}


function DataTableRow() {
    return (
        <tr>
            <td>1</td>
            {Array.from({ length: 12 }).map((_, index) => (
                <td key={index} className='text-center '>Table cell {index}</td>
            ))}
        </tr>
    );
}   