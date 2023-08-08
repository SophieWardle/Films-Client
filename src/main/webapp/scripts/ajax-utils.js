var currentID;

var format = $('#format');
var formatValue = format.val();

// Get the browser-specific request object, either for
// Firefox, Safari, Opera, Mozilla, Netscape, or IE 7 (top entry);
// or for Internet Explorer 5 and 6 (bottom entry). 
function getRequestObject() {
	if (window.XMLHttpRequest) {
		return (new XMLHttpRequest());
	} else if (window.ActiveXObject) {
		return (new ActiveXObject("Microsoft.XMLHTTP"));
	} else {
		return (null);
	}
}

// Insert the html data into the element 
// that has the specified id.
function htmlInsert(id, htmlData) {
	document.getElementById(id).innerHTML = htmlData;
}

// Return escaped value of textfield that has given id.
// The builtin "escape" function url-encodes characters.
function getValue(id) {
	return (escape(document.getElementById(id).value));
}


function ajaxGet(address, dataFormat, responseHandler) {
	var request = getRequestObject();
request.onreadystatechange =
		function() { responseHandler(request); };
	request.open("GET", address, true);
	request.setRequestHeader("Accept", dataFormat);
	request.send(null);
}

// Given an element, returns the body content.

function getBodyContent(element) {
	element.normalize();
	return (element.childNodes[0].nodeValue);
}

// Given a doc and the name of an XML element, returns an 
// array of the values of all elements with that name.
// E.g., for 
//   <foo><a>one</a><q>two</q><a>three</a></foo>
// getXmlValues(doc, "a") would return 
//   ["one", "three"].

function getXmlValues(xmlDocument, xmlElementName) {
	var elementArray =
		xmlDocument.getElementsByTagName(xmlElementName);
	var valueArray = new Array();
	for (var i = 0; i < elementArray.length; i++) {
		valueArray[i] = getBodyContent(elementArray[i]);
	}
	return (valueArray);
}

// Given an element object and an array of sub-element names,
// returns an array of the values of the sub-elements.
// E.g., for <foo><a>one</a><c>two</c><b>three</b></foo>,
// if the element points at foo,
// getElementValues(element, ["a", "b", "c"]) would return
// ["one", "three", "two"]

function getElementValues(element, subElementNames) {
	var values = new Array(subElementNames.length);
	for (var i = 0; i < subElementNames.length; i++) {
		var name = subElementNames[i];
		var subElement = element.getElementsByTagName(name)[0];
		values[i] = getBodyContent(subElement);
	}
	return (values);
}

// Takes as input an array of headings (to go into th elements)
// and an array-of-arrays of rows (to go into td
// elements). Builds an xhtml table from the data.

function getTable(headings, rows, format) {
	var table = "<table border='1' class='table-bordered'>\n" +
		getTableHeadings(headings) +
		getTableBody(rows, format) +
		"</table>";
	return (table);
}

function getTableHeadings(headings) {
	var firstRow = "  <tr>";
	for (var i = 0; i < headings.length; i++) {
		firstRow += "<th>" + headings[i] + "</th>";
	}
	firstRow += "</tr>\n";
	return (firstRow);
}

function getTableBody(rows, format) {
	console.log(format);
	var body = "";
	for (var i = 0; i < rows.length; i++) {
		body += "  <tr>";
		var row = rows[i];
		if (format.includes("json")) {
			body += "<td>" + row.title + "</td>";
			body += "<td>" + row.year + "</td>";
			body += "<td>" + row.director + "</td>";
			body += "<td>" + row.stars + "</td>";
			body += "<td>" + row.review + "</td>";
			body += "<td><button type='button' id='btnUpdate' class='btn btn-info' onclick='update(this)' value='" + row.id + "'>Update</button></td>";
			body += "<td><button type='button' id='btnDelete' class='btn btn-danger' onclick='deleteFilm(this)' value='" + row.id + "'>Delete</button></td>";
		}
		else {
			for (var j = 0; j < row.length; j++) {
				body += "<td>" + row[j] + "</td>";
			}
			body += "<td><button type='button' id='btnUpdate' class='btn btn-info' onclick='update(this)' value='" + row[row.length-1] + "'>Update</button></td>";
			body += "<td><button type='button' id='btnDelete' class='btn btn-danger' onclick='deleteFilm(this)' value='" + row[row.length-1] + "'>Delete</button></td>";
		}
		body += "</tr>\n";
	}
	return (body);
}

//Stores selected film ID in global variable, then gets parsed
//For -PUT, -DELETE requests
function getCurrentFilm(film){
	currentID = film.value;
	console.log("The current selected film is:",currentID);
}
