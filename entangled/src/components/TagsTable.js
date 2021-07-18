import React from "react";
import { useState } from 'react';
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import './TagsTable.css';
import { dSettings } from '../dictionary.js';

export default function Table({ columns, data, loadTag, addTags, toggleView, userLang }) {
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
        <div id = "tagsTableTopBar">
        <input
            value={filterInput}
            id="tagsTableSearchBar"
            onChange={handleFilterChange}
            placeholder={dSettings(20,userLang)}
        />
        <button className="tagsAddButton" id="tagsTableAddButton" onClick={addTags} >{dSettings(18,userLang)}</button>
        <button className="tagsAddButton" onClick={toggleView} >{dSettings(19,userLang)}</button>
        
        </div>
        <div id="SearchTableWrapper">

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
        </div>

        <button class="pageNumbers" onClick={() => previousPage()} disabled={!canPreviousPage} >{dSettings(22,userLang)}</button>
        <span class = "pageNumbers">
            {dSettings(45,userLang)}{' '}
            {pageIndex + 1} / {pageOptions.length}
            {' '}
        </span>
        <button class="pageNumbers" onClick={() => nextPage()} disabled={!canNextPage} >{dSettings(75,userLang)}</button>
        <select class="pageNumbers" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
            {
                [10, 15, 20].map(pageSize => (
                    <option key={pageSize} value={pageSize} >
                        {dSettings(34,userLang)} {pageSize}
                    </option>
                ))
            }
        </select>
    </>
    );
}