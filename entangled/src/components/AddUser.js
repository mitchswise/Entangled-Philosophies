import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import { addTagBatch, addTagToPaperBatch, removePaperTagBatch } from '../api';
import { addSpreadsheetPaper } from './UploadPaper';

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
