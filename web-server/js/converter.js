var _0x6780 = ["fbMask",
 "getElementById",
 "select",
 "display",
 "none",
 "style",
 "block",
 "sum_Federal",
 "Federal",
 "GovXFer",
 "State",
 "Local",
 "Category",
 "Level1",
 "Level2",
 "Level3",
 "Level4",
 "#bd0026",
 "#fecc5c",
 "#fd8d3c",
 "#f03b20",
 "#B02D5D",
 "#9B2C67",
 "#982B9A",
 "#692DA7",
 "#5725AA",
 "#4823AF",
 "#d7b5d8",
 "#dd1c77",
 "#5A0C7A",
 ",.3f",
 "format",
 "$",
 " Billion",
 "tree",
 "layout",
 "values",
 "children",
 "size",
 "toolTip",
 "head",
 "header1",
 "header2",
 "fedSpend",
 "stateSpend",
 "localSpend",
 "federalButton",
 "stateButton",
 "localButton",
 "federalDiv",
 "stateDiv",
 "localDiv",
 "y",
 "x",
 "projection",
 "diagonal",
 "svg",
 "transform",
 "translate(",
 ",",
 ")",
 "attr",
 "svg:g",
 "append",
 "height",
 "width",
 "svg:svg",
 "#body",
 "FederalBudget_2013_a.csv",
 "length",
 "push",
 "forEach",
 "entries",
 "key",
 "nest",
 "x0",
 "y0",
 "reverse",
 "nodes",
 "click",
 "class",
 "selected",
 "sum_State",
 "on",
 "sum_Local",
 "sum_",
 "range",
 "domain",
 "sqrt",
 "scale",
 "actuals",
 "csv",
 "source_",
 "parent",
 "depth",
 "max",
 "event",
 "altKey",
 "numChildren",
 "linkColor",
 "_children",
 "source",
 "id",
 "data",
 "g.node",
 "selectAll",
 " has too many departments (",
 ") to view at once.",
 "node",
 "enter",
 "stroke",
 "fill-opacity",
 ".8",
 "fill",
 "mouseout",
 "opacity",
 "0",
 "duration",
 "transition",
 "mouseover",
 "r",
 "svg:circle",
 "substr",
 "...",
 "text",
 "text-anchor",
 "end",
 "start",
 "dy",
 ".35em",
 "svg:text",
 "circle",
 "remove",
 "exit",
 "links",
 "target",
 "path.link",
 "stroke-linecap",
 "round",
 "stroke-opacity",
 "stroke-width",
 "d",
 "link",
 "svg:path",
 "g",
 "insert",
 ".9",
 "source_Level1",
 "source_Level2",
 "",
 "source_Level3",
 "html",
 " - ",
 "source_Level4",
 "top",
 "pageY",
 "px",
 "left",
 "pageX",
 "unselected"];

var fs = require('fs');

// function escapeRegExp(str) {
//   str = str.replace(/\$/g, '$$');
//   return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
// }

var promise = new Promise(function(resolve, reject) {
    fs.readFile('cleaned.js', function(err, data) {
        if (err)
            reject(err);
        else
            resolve(data.toString());
    });
});

promise.then(function(strFile) {
        for (let i = 0, l = _0x6780.length; i < l; ++i) {
            var dotNotationPattern = new RegExp('\\[_0x6780\\[' + i + '\\]\\]', 'g');
            var bracketNotationPattern = new RegExp('_0x6780\\[' + i + '\\]', 'g');
            // console.log(pattern);

            strFile = strFile.replace(dotNotationPattern, '.' + (_0x6780[i] === '$' ? '$$' : _0x6780[i]));
            strFile = strFile.replace(bracketNotationPattern, '\'' + (_0x6780[i] === '$' ? '$$' : _0x6780[i]) + '\'');

            // console.log(i);
        }

        return new Promise(function(resolve, reject) {
            fs.writeFile('done.js', strFile, function(err) { if (err) reject(err); else resolve(); });
        })
    })
    .then(function() { console.log('done'); })
    .catch(function(err) { console.log(err.stack); });








