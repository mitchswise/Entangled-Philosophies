//Handles translating the Filter into an SQL Query

import { useColumnOrder } from "react-table";

export function isDigit(val) {
    return /^\d+$/.test(val);
}

export function makeSelectAND(tagIDs, userID) {
    var numSections = 0;
    var selectQuery = "(SELECT paper_id FROM paper_tags WHERE";
    for (let index = 0; index < tagIDs.length; index++) {
        var curTag = tagIDs[index];
        if (numSections > 0) selectQuery += " AND";
        numSections++;

        var tagQuery = " paper_id IN (SELECT paper_id FROM paper_tags WHERE ((owner = 0 " +
            "OR owner = " + userID + ") AND tag_id = " + curTag + "))";

        selectQuery += tagQuery;
    }
    selectQuery += ")";

    return selectQuery;
}

export function makeSelectOR(tagIDs, userID) {
    var numSections = 0;
    var selectQuery = "(SELECT paper_id FROM paper_tags WHERE";
    for (let index = 0; index < tagIDs.length; index++) {
        var curTag = tagIDs[index];
        if (numSections > 0) selectQuery += " OR";
        numSections++;

        var tagQuery = " ((owner = 0 OR owner = " + userID + ") AND tag_id = " + curTag + ")";
        selectQuery += tagQuery;
    }
    selectQuery += ")";

    return selectQuery;
}

export function translateToSQL(filterState, userID) {
    var query = "SELECT DISTINCT paper_id FROM paper_tags";
    var numSections = 0, totalTagsUsed = 0;
    for (const index in filterState) {
        const curSection = filterState[index];

        var toInclude = [], toExclude = [];

        for (const ids in curSection) {
            if (!isDigit(ids)) continue;

            if (curSection[ids] == 1) {
                toInclude.push(ids);
            }
            else if (curSection[ids] == 2) {
                toExclude.push(ids);
            }
        }

        if (toInclude.length == 0 && toExclude.length == 0) continue;

        totalTagsUsed += toInclude.length + toExclude.length;

        if (toInclude.length > 0) {
            if (numSections == 0) query += " WHERE";
            else query += " AND";
            numSections++;

            query += " paper_id IN ";

            if (curSection["include"] === "AND") {
                query += makeSelectAND(toInclude, userID);
            }
            else {
                query += makeSelectOR(toInclude, userID);
            }
        }

        if (toExclude.length > 0) {
            if (numSections == 0) query += " WHERE";
            else query += " AND";
            numSections++;

            query += " paper_id NOT IN ";

            if (curSection["exclude"] === "AND") {
                query += makeSelectAND(toExclude, userID);
            }
            else {
                query += makeSelectOR(toExclude, userID);
            }
        }

    }

    query += ";";
    return query;
}

//Handles translating the Custom Query into an SQL Query

class ParseNode {
    constructor() {
        this.errorMessage = undefined;
        this.isResolved = false;
        this.finalSQL = undefined;
        this.nodeChildren = [];
        this.nodeChildrenNotModifier = [];
        this.operatorChildren = [];
    }
}

var parseIndex = 0;

export function parseSubsegment(equation, userID) {
    console.log("Running...");
    var node = new ParseNode();
    var expectingClose = false;

    while (parseIndex < equation.length) {
        var expecting = -1;
        if (node.nodeChildren.length <= node.operatorChildren.length) {
            expecting = 0; //expecting an equation
        }
        else {
            expecting = 1; //expecting an operator (AND OR)
        }

        switch (equation[parseIndex]) {
            case '(':
                if (expecting == 1) {
                    node.errorMessage = "Expected OPERATOR and got EQUATION at index = " + parseIndex;
                    return node;
                }
                //make recursive child
                parseIndex++;
                expectingClose = true;

                var child = parseSubsegment(equation, userID);
                if (node.nodeChildrenNotModifier.length == node.nodeChildren.length) {
                    node.nodeChildrenNotModifier.push(false);
                }

                if(child.errorMessage !== undefined) {
                    node.errorMessage = child.errorMessage;
                    return node;
                }

                node.nodeChildren.push(child);

                break;
            case ')':
                if (expecting == 0) {
                    node.errorMessage = "Expected EQUATION and got END OF EQUATION at index = " + parseIndex;
                    return node;
                }

                //this child is done, resolve it's equation and send it back
                if (expectingClose) {
                    parseIndex++;
                    node.isResolved = true;
                }
                else {
                    node.isResolved = true;
                }
                expectingClose = false;

                break;
            case 'A':
                //AND operator
                if (expecting == 0) {
                    node.errorMessage = "Expected EQUATION and got OPERATOR 'AND' at index = " + parseIndex;
                    return node;
                }

                node.operatorChildren.push("AND");
                parseIndex += 3;

                break;
            case 'O':
                //OR operator
                if (expecting == 0) {
                    node.errorMessage = "Expected EQUATION and got OPERATOR 'OR' at index = " + parseIndex;
                    return node;
                }

                node.operatorChildren.push("OR");
                parseIndex += 2;

                break;
            case 'N':
                //NOT modifier
                if (expecting == 1) {
                    node.errorMessage = "Expected OPERATOR and got 'NOT' modifier at index = " + parseIndex;
                    return node;
                }

                parseIndex += 3;
                node.nodeChildrenNotModifier.push(true);

                break;
            default:
                //should be strictly digits, get tag
                if (expecting == 1) {
                    node.errorMessage = "Expected OPERATOR and got Tag at index = " + parseIndex;
                    return node;
                }
                if (!isDigit(equation[parseIndex])) {
                    node.errorMessage = "Expected Tag and got " + equation[parseIndex];
                    return node;
                }
                var now = parseIndex;
                while (now < equation.length && isDigit(equation[now])) {
                    now++;
                }
                var tagID = equation.substring(parseIndex, now);


                var singleNode = new ParseNode();
                singleNode.finalSQL = "SELECT paper_id FROM paper_tags WHERE (owner = 0 OR owner = "
                    + userID + ") AND tag_id = " + tagID;

                if (node.nodeChildrenNotModifier.length == node.nodeChildren.length) {
                    node.nodeChildrenNotModifier.push(false);
                }
                node.nodeChildren.push(singleNode);
                parseIndex = now;

                break;
        }
        if (node.isResolved) break;
    }

    if (!node.isResolved) {
        node.errorMessage = "Reached end of equation";
        return node;
    }
    else {
        var query = "SELECT paper_id FROM paper_tags WHERE ";
        var mergedStrings = [];

        for (let i = 0; i < node.nodeChildren.length; i++) {
            var j = i;
            var notAdditive = "";
            if (node.nodeChildrenNotModifier[i] == true) {
                notAdditive = "NOT ";
            }
            var addQuery = "(paper_id " + notAdditive + "IN (" + node.nodeChildren[i].finalSQL + ")";
            while (j < node.operatorChildren.length && node.operatorChildren[j] == "AND") {
                addQuery += " AND ";

                notAdditive = "";
                if (node.nodeChildrenNotModifier[j + 1] == true) {
                    notAdditive = "NOT ";
                }
                addQuery += "paper_id " + notAdditive + "IN (" + node.nodeChildren[j + 1].finalSQL + ")";
                j++;
            }
            addQuery += ")";
            mergedStrings.push(addQuery);

            i = j;
        }

        for (let i = 0; i < mergedStrings.length; i++) {
            if (i > 0) query += " OR ";
            query += mergedStrings[i];
        }

        node.finalSQL = query;
    }

    return node;
}

export function parseCustomQuery(equation, userID) {
    parseIndex = 0;
    var result = {errorMessage:undefined, query:undefined};

    //clean out unnecessary spaces
    var newExpression = "";
    var bracketList = [], tagsList = [];

    for (let i = 0; i < equation.length; i++) {
        if (equation[i] == ' ') continue;
        if (equation[i] == '`') {
            var pos = -1;
            newExpression += equation[i];
            var j = i + 1;
            while (j < equation.length && equation[j] != '`') {
                newExpression += equation[j];
                j++;
            }
            if (j == equation.length || i + 1 == j) {
                result.errorMessage = "Bad expression at index = " + i;
                return result;
            }
            newExpression += equation[j];
            var tag = equation.substring(i + 1, j);
            tagsList.push(tag);

            i = j;
            continue;
        }
        newExpression += equation[i];
    }

    equation = newExpression;

    console.log("!NewEquation " + equation);

    //check for malformed expression
    var tagIndex = 0;
    for (let i = 0; i < equation.length; i++) {
        if (equation[i] == ' ') continue;
        if (equation[i] == '`') {
            i += tagsList[tagIndex].length + 1;
            tagIndex++;
            if(i + 1 < equation.length) {
                if(equation[i+1] == '(' || equation[i+1] == '`' || equation[i+1] == 'N') {
                    result.errorMessage = "Bad expression expected operator at index = " + i;
                    return result;
                }
            }
            continue;
        }
        switch (equation[i]) {
            case '(':
                bracketList.push('(');
                break;
            case ')':
                if (bracketList.length == 0 || bracketList[bracketList.length - 1] != '(') {
                    result.errorMessage = "Bad expression detected on closing ')' at index = " + i;
                    return result;
                }
                bracketList.pop();
                break;
            case 'A':
                if (i + 4 > equation.length || (equation.substring(i, i + 4) !== "AND("
                    && equation.substring(i, i + 4) !== "AND`" && equation.substring(i,i+4) !== "ANDN" )) {
                    result.errorMessage = "Failed parse on AND " + i;
                    return result;
                }
                i += 2;
                break;
            case 'O':
                if (i + 3 > equation.length || (equation.substring(i, i + 3) !== "OR("
                    && equation.substring(i, i + 3) !== "OR`" && equation.substring(i,i+3) !== "ORN")) {
                    result.errorMessage = "Failed parse on OR " + i;
                    return result;
                }
                i++;
                break;
            case 'N':
                if (i + 4 > equation.length || (equation.substring(i, i + 4) !== "NOT("
                    && equation.substring(i, i + 4) !== "NOT`")) {
                    result.errorMessage = "Failed parse on NOT " + i;
                    return result;
                }
                i += 2;
                break;
            default:
                result.errorMessage = "Bad expression " + i + " " + equation[i];
                return result;
        }
    }
    if (bracketList.length > 0) {
        result.errorMessage = "Bad expression detected on unmatched '(' at end of string";
        return result;
    }

    //VERIFY THAT THESE TAGS tagsList EXIST!

    //replace tag[i] with it's identifier
    var tagToInt = {};
    for (const index in tagsList) {
        if (!(tagsList[index] in tagToInt)) {
            tagToInt[tagsList[index]] = index;
        }
    }


    newExpression = "";
    for (let i = 0; i < equation.length; i++) {
        if (equation[i] === '`') {
            var j = i + 1;
            while (j < equation.length && equation[j] != '`') j++;
            var tag = equation.substring(i + 1, j);
            newExpression += tagToInt[tag];

            i = j;
        }
        else {
            newExpression += equation[i];
        }
    }

    equation = newExpression;
    console.log("Converted: " + equation);

    var x = parseSubsegment(equation, userID);
    result.errorMessage = x.errorMessage;
    result.query = x.finalSQL;
    return result;
    // console.log("ERROR: " + x.errorMessage)
    // console.log(x.finalSQL);
    // console.log("FIN");
}