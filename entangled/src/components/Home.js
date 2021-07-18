import React from 'react';
import { dSettings } from '../dictionary';
import './Home.css';

export default class Home extends React.Component {
    render() {
        let userLang = this.props.userLang;

        return <div className="container">
            <div className="header">
                <h1 id="title">{dSettings(4, userLang)}</h1>
            </div>
            <body>
                
            </body>
        </div>

    }
}