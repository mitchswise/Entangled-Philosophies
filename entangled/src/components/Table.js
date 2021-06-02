import React from "react";
import { useState } from 'react';
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import { cookies } from "../api";
import './Table.css';

export default function Table({ columns, data, loadFilter, saveQuery }) {
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
        setFilter("paper_id", value);
        setFilterInput(value);
    };

    return (
        <>
        <div>
        <input
            type="button"
            value="Save Query"
            disabled={!cookies.get('UserID')}
            onClick={saveQuery}
        />
        <input
            type="button"
            value="Filter"
            onClick={loadFilter}
        />
        <input
            value={filterInput}
            id="searchSearchBar"
            onChange={handleFilterChange}
            placeholder={"Search name"}
        />
        
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
                <tr {...row.getRowProps()} >
                    {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                    })}
                </tr>
                );
            })}
            </tbody>
        </table>
        <select id="pageNumbers" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
            {
                [10, 15, 20].map(pageSize => (
                    <option key={pageSize} value={pageSize} >
                        Show {pageSize}
                    </option>
                ))
            }
        </select>
        <button id="pageNumbers" onClick={() => previousPage()} disabled={!canPreviousPage} >Previous</button>
        <span id = "pageNumbers">
            Page{' '}
            {pageIndex + 1} / {pageOptions.length}
            {' '}
        </span>
        <button id="pageNumbers" onClick={() => nextPage()} disabled={!canNextPage} >Next</button>
    </>
    );
}