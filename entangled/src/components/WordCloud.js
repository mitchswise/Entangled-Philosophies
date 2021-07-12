import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import { cookies, getWordCloudTags } from '../api';

const options = {
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
    enableTooltip: true,
    deterministic: false,
    fontFamily: "impact",
    fontSizes: [20, 60],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 0],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000
};

export default class WordCloud extends React.Component {
    collectTags = () => {
        try {
            const paperData = this.props.paperData;
            if (paperData.length == 0) {
                return [];
            }

            var userID = 0;
            if (cookies.get('UserID')) userID = cookies.get('UserID');
            var prefLang = this.props.userLang;

            var paperIDs = [];
            for (const idx in paperData) {
                paperIDs.push(paperData[idx].id);
            }

            var dict = { userID: userID, language: prefLang, papers: paperIDs };
            return getWordCloudTags(dict).tags;
        }
        catch (error) {
            return [];
        }
    }
    
    state = {
        words: this.collectTags(this.props.paperData),
        wordLimit: undefined
    }

    changeSort = () => {
        var eID = document.getElementById("selectSort");
        var order = eID.options[eID.selectedIndex].value;

        const newWords = this.state.words.slice();

        if(order == "Ascending") {
            newWords.sort(function(first, second) {
                return parseInt(first.value) - parseInt(second.value);
            });
        }
        else {
            newWords.sort(function(first, second) {
                return parseInt(second.value) - parseInt(first.value);
            });
        }

        this.setState({ words: newWords });
    }

    changeNumber = () => {
        var value = document.getElementById("quantity").value;
        if(!value) return;
        if(value > this.state.words.length) value = this.state.words.length;
        this.setState({ wordLimit: value })
    }

    getWordLimit = () => {
        if(!this.state.wordLimit) return this.state.words.length;
        return this.state.wordLimit;
    }

    render() {
        let wordLimit = this.getWordLimit();
        const words = this.state.words.slice(0, wordLimit);


        return (
            <>
            <div id="wordCloudWrapper" style={{height: "100%"}} >
                <div id="wordCloudComponent" style={{height:"95%"}}>
                    <ReactWordcloud words={words} options={options} />
                </div>
                <div id="wordCloudOptions" style={{paddingLeft:"30%", display:"flex"}}>
                    <select id="selectSort" onChange={this.changeSort} >
                        <option value="Descending">Most frequent</option>
                        <option value="Ascending">Least frequent</option>
                    </select>
                    <input type="number" id="quantity" name="quantity" min="0" 
                        max={this.state.words.length} />
                    <button onClick={this.changeNumber}>Update</button>
                </div>
            </div>
            </>
        );
    }

}