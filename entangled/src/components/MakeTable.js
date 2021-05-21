import React, { useMemo, useState, useEffect } from "react";
import Table from "./Table";

function stringGen() {
    var len = 3;
    var text = "";
    
    var charset = "abcdefghijklmnopqrstuvwxyz";
    
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
}

function numGen() {
    return Math.floor(Math.random() * 20)+1;
}

function makeData() {
    var jsonData = [];
    for(var i = 0; i < 200; i++) {
        var dict = {};
        dict['name'] = stringGen()
        dict['age'] = numGen()
        jsonData.push(dict);
    }
    return jsonData;
    
}

export function MakeTable () {
    const columns = useMemo(
    () => [
        {
        Header: "Name",
        accessor: "name"
        },
        {
        Header: "Age",
        accessor: "age"
        }
    ],
    []
    );

    const data = makeData()

    return (
    <div className="MakeTable">
        <Table columns={columns} data={data} />
    </div>
    );
}