import React from 'react';
import './Home.css';
import { MakeTable } from './MakeTable.js';

export default class Home extends React.Component {
    render() {
        return <div className="container">
            <div className="header">
                <h1 id="title">Home</h1>
            </div>
            <body>
                <MakeTable></MakeTable>
            </body>
        </div>

    }
}