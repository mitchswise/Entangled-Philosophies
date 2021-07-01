import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import { addTagBatch, addTagToPaperBatch, removePaperTagBatch } from '../api';
import { addSpreadsheetPaper } from './UploadPaper';

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
  var pass = {title:"Testing Spreadsheet Paper"};
  pass["Author"] = "SomeAuthor";
  pass["Subject"] = "";
  pass["Manual Tags"] = "ABC";
  pass["Date"] = "999";
  pass["Contributor"] = "NonExistentContributor";
  pass["Url"] = "www.philosophy.com";

  console.log(JSON.stringify(pass));


  var result = addSpreadsheetPaper(pass);
  console.log(JSON.stringify(result));
}

export default class AddUser extends React.Component {
    render() {
        const element = (
          <button onClick={checkEndpoint} >click</button>
        );
        return element; 
    }
}
