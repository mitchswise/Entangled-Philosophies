import React from "react";
import { useState } from 'react';
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import './TagsTable.css';

export default function Table({ columns, data, loadTag, addTags, toggleView }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        setFilter,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        setPageSize,
        pageOptions,
        state
    } = useTable({
        columns,
        data
    },
    useFilters,
    useSortBy,
    usePagination);

    const { pageIndex, pageSize } = state;
    const [filterInput, setFilterInput] = useState("");

    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setFilter("text", value);
        setFilterInput(value);
    };

    return (
        <>
        <div>
        <input
            value={filterInput}
            id="tagsSearchBar"
            onChange={handleFilterChange}
            placeholder={"Search name"}
        />
        <button id="tagsAddButton" onClick={addTags} >Add</button>
        <button id="tagsAddButton" onClick={toggleView} >Toggle</button>
        
        </div>
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
                <tr {...row.getRowProps()} 
                        onClick={() => loadTag(row.original)} >
                    {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                    })}
                </tr>
                );
            })}
            </tbody>
        </table>
     
        <button class="pageNumbers" onClick={() => previousPage()} disabled={!canPreviousPage} >Previous</button>
        <span class = "pageNumbers">
            Page{' '}
            {pageIndex + 1} / {pageOptions.length}
            {' '}
        </span>
        <button class="pageNumbers" onClick={() => nextPage()} disabled={!canNextPage} >Next</button>
        <select class="pageNumbers" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
            {
                [10, 15, 20].map(pageSize => (
                    <option key={pageSize} value={pageSize} >
                        Show {pageSize}
                    </option>
                ))
            }
        </select>
    </>
    );
}