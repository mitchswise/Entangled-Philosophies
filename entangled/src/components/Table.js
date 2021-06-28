import React from "react";
import { useState } from 'react';
import { useTable, useFilters, useSortBy, usePagination, useGlobalFilter } from "react-table";
import { cookies } from "../api";
import './Table.css';

export default function Table({ columns, data, loadFilter, saveQuery, loadPaper, loadOptions }) {
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

    var browser = navigator.userAgent.toLowerCase().indexOf('chrome') > -1 ? 'other' : 'mozilla';
    var searchBarID = browser == 'other' ? "searchSearchBarChrome" : "searchSearchBarMozilla"

    return (
        <>
            <div class="leftBoxTop">
                <input id="saveQuery"
                    type="button"
                    value="Save Query"
                    disabled={!cookies.get('UserID')}
                    onClick={saveQuery}
                />
                <input id="Filter"
                    type="button"
                    value="Filter"
                    onClick={loadFilter}
                />
                <input
                    value={filterInput}
                    id={searchBarID}
                    onChange={handleFilterChange}
                    placeholder={"Search name"}
                />
                <input
                    id="rightButtons"
                    type="button"
                    value="Visualize"
                    onClick={console.log("Hi")}
                />
                <input
                    id="rightButtons"
                    type="button"
                    value="Options"
                    onClick={loadOptions}
                />

            </div>

            <div id="SearchTableWrapper" >

                <table  {...getTableProps()}>
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
                    <tbody id="SearchLeftTable" {...getTableBodyProps()}>
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

            </div>

            <div id="prevNextBox">

                <button class="pageNumbers" onClick={() => previousPage()} disabled={!canPreviousPage} >Previous</button>
                <span class="pageNumbers">
                    Page{' '}
                    {pageIndex + 1} / {pageOptions.length}
                    {' '}
                </span>
                <button class="pageNumbers" onClick={() => nextPage()} disabled={!canNextPage} >Next</button>
                <select class="pageNumbers" id="showNumber" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                    {
                        [10, 15, 20].map(pageSize => (
                            <option key={pageSize} value={pageSize} >
                                Show {pageSize}
                            </option>
                        ))
                    }
                </select>
            </div>

        </>
    );
}