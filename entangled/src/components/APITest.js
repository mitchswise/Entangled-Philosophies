import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import {testConnect} from '../api.js';

function testFunc() {
    var data = testConnect();
    document.getElementById("ansField").innerHTML = ("Number of rows in Papers table: " + data.NumRows);
}

export default class APITest extends React.Component {
    render() {
        const element = (
        <div className="container" id="outer-container"> 
            <h1> Hello World!</h1>
            <button type="button" id="checker" onClick={testFunc}>Test Endpoint</button>
            <div id="ansField">Number of rows in Papers table: </div>
        </div>
        );
        return element; 
    }
}