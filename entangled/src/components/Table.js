import React from "react";
import { useState } from 'react';
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import './Table.css';

export default function Table({ columns, data }) {
    const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // headerGroups, if your table has groupings
        page, // rows for the table based on the data passed
        prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
        setFilter,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage
    } = useTable({
        columns,
        data
    },
    useFilters,
    useSortBy,
    usePagination);

    const [filterInput, setFilterInput] = useState("");

    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setFilter("name", value);
        setFilterInput(value);
    };

    return (
        <>
        
        <table {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={
                      column.isSorted
                        ? column.isSortedDesc
                          ? "sort-desc"
                          : "sort-asc"
                        : ""
                    }
                  >
                    {column.render("Header")}
                  </th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
                prepareRow(row);
                return (
                <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                    })}
                </tr>
                );
            })}
            </tbody>
        </table>
        <div>
        <input
            value={filterInput}
            onChange={handleFilterChange}
            placeholder={"Search name"}
        />
        <button onClick={() => previousPage()} disabled={!canPreviousPage} >Previous</button>
        <button onClick={() => nextPage()} disabled={!canNextPage} >Next</button>
        </div>
    </>
    );
}