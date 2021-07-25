import React from 'react';
import { dSettings } from '../dictionary';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

export default class Home extends React.Component {

    state = {
        helpVideo: false
    }

    openHelpVideo = () => {
        this.setState((prevState) => ({ helpVideo: !prevState.helpVideo }));
    }

    render() {
        let userLang = this.props.userLang;

        return <div className="container">
            <div >
                <h1 id="title">{dSettings(4, userLang)}</h1>
                <div id="iconWrapper" onClick={this.openHelpVideo}>
                    <FontAwesomeIcon icon={faQuestionCircle} id="HomeQuestionCircle" size='2x' />
                </div>
                <div className="img" id="ImageWrapper" />
            </div>
            <body>
            </body>
        </div>

    }
}