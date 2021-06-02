import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useTable, useFilters, useSortBy, usePagination, useGlobalFilter } from "react-table";
import { cookies, getQueries } from '../api.js'
import Search from './Search.js';
import './Queries.css';

function QueriesTable({ columns, data, toggleView, setSearchFlag }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        setPageSize,
        pageOptions,
        state,
        setGlobalFilter
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
            value={filterInput}
            id="queriesSearchBar"
            onChange={handleFilterChange}
            placeholder={"Search"}
        />
        <button id="queriesToggle" onClick={toggleView} >Toggle</button>
        
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
                        onClick={() => setSearchFlag(row.original)} >
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

function getQueryData() {
    if(!cookies.get('UserID')) return [];
    var data = getQueries(cookies.get('UserID'));

    for(const x in data.queries) {
        var text = data.queries[x].query_text;
        if(text.length > 80) {
            text = text.substring(0, 80)+"...";
        }
        data.queries[x].query_text_fixed = text;
    }

    return data.queries;
}
const allQueries = getQueryData();

function getSavedQueries() {
    var allSaved = [];
    for(const x in allQueries) {
        if(allQueries[x].is_history == 0) {
            allSaved.push(allQueries[x]);
        }
    }
    return allSaved;
}
function getSavedHistory() {
    var allHistory = [];
    for(const x in allQueries) {
        if(allQueries[x].is_history == 1) {
            allHistory.push(allQueries[x]);
        }
    }
    return allHistory;
}

const columnsSavedQuery = [
    {
        Header: "Name",
        accessor: "name"
    },
    {
        Header: "Date",
        accessor: "date"
    },
    {
        Header: "Query",
        accessor: "query_text_fixed"
    }
];

const columnsHistoryQuery = [
    {
        Header: "Date",
        accessor: "date"
    },
    {
        Header: "Query",
        accessor: "query_text_fixed"
    }
];


export default class Queries extends React.Component {

    state = {
        savedQueries: getSavedQueries(),
        savedHistory: getSavedHistory(),
        toggleState: false,
        redirectToSearch: false,
        redirectFilter: null
    }

    renderRedirect = () => {
        if(!cookies.get('UserID')) {
            return <Redirect to = '/' />
        }
    }

    toggleView = () => {
        this.setState((prevState) => ({ toggleState: !prevState.toggleState }));
    }

    setSearchFlag = (query) => {
        this.setState({ redirectFilter: JSON.parse(query.query_text) });
        this.setState({ redirectToSearch: true });
    }

    loadSearch = () => {
        return <Redirect
            to={{
                pathname: "/search",
                state: { filterState: this.state.redirectFilter }
            }} 
        />
    }

    render() {
        const { toggleState, savedQueries, savedHistory, redirectToSearch } = this.state;
        return (<div id="searchContainer">
            <div className="header">
                {
                    toggleState === false ? <h1 id="title">Saved Queries</h1>
                    : <h1 id="title">Search History</h1>
                }
            </div>
            {this.renderRedirect()}
            {redirectToSearch ? this.loadSearch() : <></>}
            <body>
                <div id="wrapper">
                    {
                        toggleState === false ? 
                            <QueriesTable columns={columnsSavedQuery} data={savedQueries}
                                toggleView={this.toggleView} setSearchFlag={this.setSearchFlag} />
                        : <QueriesTable columns={columnsHistoryQuery} data={savedHistory}
                                toggleView={this.toggleView} setSearchFlag={this.setSearchFlag} />
                    }
                </div>
            </body>
            
        </div>);
    }
}