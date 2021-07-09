import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useTable, useFilters, useSortBy, usePagination, useGlobalFilter, useRowSelect } from "react-table";
import { cookies, getQueries, removeQueries, getTags } from '../api.js'
import { Checkbox } from './Checkbox.js';
import { getGlobalLanguage } from "../api.js";
import './Queries.css';

var userLanguage = getGlobalLanguage();

function QueriesTable({ columns, data, toggleView, setSearchFlag, deleteQueries }) {
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
        setGlobalFilter,
        selectedFlatRows
    } = useTable({
        columns,
        data
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
        hooks.visibleColumns.push((columns) => {
            return [
                ...columns,
                {
                    id: 'selection',
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <Checkbox {...getToggleAllRowsSelectedProps()} />
                    ),
                    Cell: ({ row }) => (
                        <Checkbox {...row.getToggleRowSelectedProps()} />
                    )
                }
            ]
        })
    }
    );

    const { pageIndex, pageSize, globalFilter } = state;
    const [filterInput, setFilterInput] = useState("");

    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setGlobalFilter(value);
        setFilterInput(value);
    };

    return (
        <>
        <div id="queriesBox">
        <div id = "queryTopBar">
        <input
            value={filterInput}
            id="queriesSearchBar"
            onChange={handleFilterChange}
            placeholder={"Search"}
        />
        <button id="queriesToggle" onClick={toggleView} >Toggle</button>
        <button id="queriesDelete" onClick={() => deleteQueries(selectedFlatRows.map((row) => row.original))} >Delete</button>
        
        </div>
        <div id="queriesTableWrapper">
        <table id="queriesTable" {...getTableProps()}>
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
                        onClick={(e) => {
                            if(e.target.cellIndex != undefined && e.target.cellIndex != 3) {
                                setSearchFlag(row.original)
                            }
                        }} >
                    {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                    })}
                </tr>
                );
            })}
            </tbody>
        </table>
        </div>
        <div id="queriesBottom">
        <button id="pageNumbers" onClick={() => previousPage()} disabled={!canPreviousPage} >Previous</button>
        <span id = "pageNumbers">
            Page{' '}
            {pageIndex + 1} / {pageOptions.length}
            {' '}
        </span>
        <button id="pageNumbers" onClick={() => nextPage()} disabled={!canNextPage} >Next</button>
        </div>
        </div>

    </>
    );
}

function getQueryData() {
    if(!cookies.get('UserID')) return [];
    var data = getQueries(cookies.get('UserID'));

    var prefLang = userLanguage;
    var allTags = getTags(cookies.get('UserID'), prefLang);
    var tagDict = {};
    for(const index in allTags.tags) {
        var tag_id = allTags.tags[index].tag_id;
        tagDict[parseInt(tag_id)] = allTags.tags[index].text;
    }

    for(const x in data.queries) {
        var display_query = data.queries[x].display_query;
        if(display_query == null) continue;
        var real_display_query = "", display_failed = false;
        var real_custom_query = "";

        for(let i = 0; i < display_query.length; i++) {
            if(display_query[i] == '`') {
                var j = i+1;
                while(j < display_query.length && display_query[j] != '`') j++;

                var tag = display_query.substring(i+1, j);
                if(!(parseInt(tag) in tagDict)) {
                    real_display_query = "MISSING TAG(s)";
                    display_failed = true;
                    real_custom_query += "``";
                }
                else {
                    if(!display_failed) real_display_query += "`" + tagDict[parseInt(tag)] + "`";
                    real_custom_query += "`" + tagDict[parseInt(tag)] + "`";
                }

                i = j;
            }
            else {
                if(!display_failed) {
                    real_display_query += display_query[i];
                }
                real_custom_query += display_query[i];
            }
        }
        data.queries[x].display_query = real_display_query;
        data.queries[x].send_custom_query = real_custom_query;
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
        accessor: "display_query"
    }
];

const columnsHistoryQuery = [
    {
        Header: "Date",
        accessor: "date"
    },
    {
        Header: "Query",
        accessor: "display_query"
    }
];


export default class Queries extends React.Component {

    state = {
        savedQueries: getSavedQueries(),
        savedHistory: getSavedHistory(),
        toggleState: false,
        redirectToSearch: false,
        redirectFilter: undefined,
        redirectCustomQuery: undefined
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
        if(query.query_type === "JSON") {
            this.setState({ redirectFilter: JSON.parse(query.query_text) });
        }
        else {
            var newRedirectCustom = { original_input: query.send_custom_query, has_error: false };
            if(query.display_query == "MISSING TAG(s)") {
                newRedirectCustom.has_error = true;
            }
            this.setState({ redirectCustomQuery: newRedirectCustom });   
        }
        this.setState({ redirectToSearch: true });
    }

    loadSearch = () => {
        var sendState = {};
        if(this.state.redirectFilter !== undefined) {
            sendState = { filterState: this.state.redirectFilter };
        }
        else {
            sendState = { customQuery: this.state.redirectCustomQuery };
        }

        return <Redirect
            to={{
                pathname: "/search",
                state: sendState
            }} 
        />
    }

    handleQueryDelete(allSelected) {
        var toDelete = []
        for(const x in allSelected) {
            toDelete.push(allSelected[x].id);
        }
        var dict = {delete:toDelete};
        var data = removeQueries(dict);
        window.location.reload();
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
                    {
                        toggleState === false ? 
                            <QueriesTable columns={columnsSavedQuery} data={savedQueries}
                                toggleView={this.toggleView} setSearchFlag={this.setSearchFlag}
                                deleteQueries={this.handleQueryDelete} />
                        : <QueriesTable columns={columnsHistoryQuery} data={savedHistory}
                                toggleView={this.toggleView} setSearchFlag={this.setSearchFlag} 
                                deleteQueries={this.handleQueryDelete} />
                    }

            </body>

        </div>
        );
    }
}