import React from "react";
import { useState } from 'react';
import { useTable, useFilters, useSortBy, usePagination, useGlobalFilter } from "react-table";
import { cookies } from "../api";
import { dSettings } from '../dictionary.js';
import './Table.css';

export default function Table({ columns, data, loadFilter, saveQuery, loadPaper, loadOptions, loadVisualize, userLang }) {
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

                <button id="saveQuery" disabled={!cookies.get('UserID')} onClick={saveQuery}>{dSettings(52,userLang)}</button>

                <button id="Filter" onClick={loadFilter}>{dSettings(32,userLang)}</button>

                <input
                    value={filterInput}
                    id={searchBarID}
                    onChange={handleFilterChange}
                    placeholder={dSettings(51,userLang)}
                />


                <div class="dropdownSearch">
                    <button class="dropbtnSearch">{dSettings(54,userLang)}</button>
                    <div class="dropdown-contentSearch">
                        <button className="rightButton2" onClick={() => loadVisualize(1)}>{dSettings(55,userLang)}</button>
                        <button className="rightButton2" id="barChartButton" onClick={() => loadVisualize(2)}>{dSettings(56,userLang)}</button>
                    </div>
                </div>



                <button id="rightButtons" onClick={loadOptions}>{dSettings(135, userLang)}</button>

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
            
            <button class="pageNumbers" onClick={() => previousPage()} disabled={!canPreviousPage} >{dSettings(73,userLang)}</button>
            <span class="pageNumbers">
                {dSettings(74,userLang)}{' '}
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