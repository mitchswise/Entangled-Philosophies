import React from "react";
import { useState } from 'react';
import { useTable, useFilters, useSortBy, usePagination, useGlobalFilter } from "react-table";
import { cookies } from "../api";
import './Table.css';

export default function Table({ columns, data, loadFilter, saveQuery, loadPaper }) {
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
        state,
        setGlobalFilter,
    } = useTable({
        columns,
        data
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination);

    const { pageIndex, pageSize, globalFilter } = state;
    const [filterInput, setFilterInput] = useState("");

    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setGlobalFilter(value);
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
                <tr {...row.getRowProps()}
                        onClick={() => loadPaper(row.original)} >
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