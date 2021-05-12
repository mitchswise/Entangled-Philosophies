import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import {testConnect} from '../api.js';
import './APITest.css';
function testFunc() {
    var data = testConnect();
    document.getElementById("ansField").innerHTML = ("Number of rows in Papers table: " + data.NumRows);
}

export default class APITest extends React.Component {
    render() {
        const element = (
        <div className="container" id="outer-container"> 
        <div className="header">     
               <h1 id="title">API Test Page</h1>
</div>
            <button type="button" id="checker" onClick={testFunc}>Test Endpoint</button>
            <div id="ansField">Number of rows in Papers table: </div>
        </div>
        );
        return element; 
    }
}