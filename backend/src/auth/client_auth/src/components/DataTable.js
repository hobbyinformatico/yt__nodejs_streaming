import { DataGrid } from '@mui/x-data-grid';
//import { useEffect, useState } from 'react';

/*
const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
];
*/

export default function DataTable({
    content,
    onClickCell = (event) => { },
    onClickRow = (row) => { },
    onRowSelected = undefined
}) {

    const rows = getRows();
    const columns = getColumns();


    function getRows() {
        if (Array.isArray(content) && content.length > 0) {
            return content;
        }
        return [];
    }

    function getColumns() {
        let res = [];
        if (Array.isArray(content) && content.length > 0) {
            const keys = Object.keys(content[0]);
            res = keys.map((k) => ({
                field: k,
                headerName: k,
                sortable: true,
                width: 130
            }));
        }
        return res;
    }

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                // fa in modo che la selezione di una riga avvenga
                // SOLO cliccando dulle checkbox
                disableRowSelectionOnClick
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection={(onRowSelected != null) ? true : undefined}
                //onRowClick={onClickRow}
                onCellClick={(event) => {
                    onClickCell(event);
                    onClickRow(event.row);
                }}
                onRowSelectionModelChange={(idsSelected) => {
                    onRowSelected(idsSelected);
                }}
            />
        </div>
    );
}
