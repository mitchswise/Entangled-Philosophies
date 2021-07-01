import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import { addTagBatch, addTagToPaperBatch, removePaperTagBatch } from '../api';

export const options = {
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

function checkEndpoint() {
  var arr = [{tag_id: 205}, {tag_id: 204}];
  var dict = {userID: 0, paper_id:278, tagsArray:arr};

  var data = removePaperTagBatch(dict);
  console.log("Done: " + JSON.stringify(data));
}

export default class AddUser extends React.Component {
    render() {
        const element = (
          <button onClick={checkEndpoint} >click</button>
        );
        return element; 
    }
}
