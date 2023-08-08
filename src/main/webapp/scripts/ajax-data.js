//global array to store all films
var allFilms = [];

//function to populate the gloabl array
function populateArray(data){
	allFilms = data;
}


//Initiate Request
function filmTable(formatField, resultRegion) {
	console.log(getValue(formatField));
	var address = "./Film-REST";
	var format = getValue(formatField);
	var responseHandler = findHandler(format);
	ajaxGet(address, format,
		function(request) {
			responseHandler(request, resultRegion,format);
		});
}

function findHandler(format) {
	if (format.includes("xml")) {
		return showXmlFilmInfo;
	}
	else if (format.includes("json")) {
		return showJsonFilmsInfo;
	}
	else if (format.includes("text")){
		return showStringFilmInfo;
	}
}

//Response Handlers

function showXmlFilmInfo(request, resultRegion,format) {
	if ((request.readyState == 4) &&
		(request.status == 200)) {
		var xmlDocument = request.responseXML;
		//Get all data by xml tags
		var films = xmlDocument.getElementsByTagName("film");
		//Get rows
		var rows = new Array(films.length);
		populateArray(rows);
		//Define subElements
		var subElementNames = ["title", "year", "director","stars","review"];
		//iterate through the list
		for (var i = 0; i < films.length; i++) {
			rows[i] =
				getElementValues(films[i], subElementNames);
		}
		//create the table
		var table = getTable(["Title", "Year", "Director","Stars","Review"], rows,format);
		htmlInsert(resultRegion, table);
	}
}

function showJsonFilmsInfo(request, resultRegion,format) {
	if ((request.readyState == 4) && (request.status == 200)) {
		var rawData = request.responseText;
		var data = JSON.parse(rawData);
		populateArray(data);
		var table = getTable(["Title", "Year", "Director","Stars","Review"], data,format);
		htmlInsert(resultRegion, table);
	}
}

function showStringFilmInfo(request, resultRegion,format) {
	if ((request.readyState == 4) && (request.status == 200)) {
		var rawData = request.responseText;
		var rowStrings = rawData.split(/[\n\r]+/);
		var films = rowStrings[0].split("$");
		var rows = new Array(films.length - 1);
		for (var i = 1; i < films.length; i++) {
			rows[i - 1] = films[i].split("#");
		}
		populateArray(rows);
		var table = getTable(["Title", "Year", "Director","Review","Stars"], rows,format);
		htmlInsert(resultRegion, table);
	}
}