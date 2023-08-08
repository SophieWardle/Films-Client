var format;

document.getElementById("modal-film-table").addEventListener("submit", function(event){
    event.preventDefault();
	var convertData = formatHandler($('#insertFormat').val());
	$.ajax({
		type: "POST",
		url: "./Film-REST",
		data: convertData(0,$('#title').val(),$('#year').val(), $('#director').val(),
		 $('#stars').val(), $('#review').val()),
		contentType: $('#insertFormat').val(),
		success: function(result) {
			console.log(result);
			$('#insertFilm').html(result).attr('class', 'alert alert-success');
			filmTable('format', 'result');
			$('#newFilmModal').modal('hide');
			$("html, body").animate({scrollTop: $(document).height()},0);
		},
		error: function(result, status){
			$('#insertFilm').html(result).attr('class','alert alert-danger');
		}
	});
});

//TESTING PURPOSES
	//console.log(convertData(0,$('#title').val(),$('#year').val(), $('#director').val(), $('#stars').val(), $('#review').val()));
	//console.log(convertData);
	//console.log(document.getElementById("title").value);
	//console.log(document.getElementById("year").value);
	//console.log(document.getElementById("director").value);
	//console.log(document.getElementById("review").value);
	//console.log(document.getElementById("stars").value);

document.getElementById("format").addEventListener("change", function(event){
	console.log("a change of format: " + this.value);
	format = this.value;
	console.log(format);
	console.log(allFilms);
	console.log(allFilms[1][0]);
	filmTable('format','result');
});

//Open the new film modal when link is clicked
$("#addFilm").on("click", function(){
	$("#newFilmModal").modal("show");
});

	
document.getElementById("update-film-table").addEventListener("submit", function(event){
	event.preventDefault();
	var convertData = formatHandler($('#updateFormat').val());
	$.ajax({
		type: "PUT",
		url: "./Film-REST",
		data: convertData(currentID,$('#updateTitle').val(),$('#updateYear').val(), $('#updateDirector').val(), $('#updateStars').val(), $('#updateReview').val()),
		contentType: $('#updateFormat').val(),
		success: function(result) {
			console.log(result);
			//Write a success message
			$('#updateFilm').html(result).attr('class', 'alert alert-success');
			filmTable('format', 'result');
			$('#updateModal').modal('hide');
			//$("html, body").animate({scrollTop: $(document).height()},0);
		},
		//on error
		error: function(result, status){
			$('#insertFilm').html(result).attr('class','alert alert-danger');
		}
	});
});

function deleteFilm(film){
	var currentFilm = film.value;
	var id = currentFilm;
	currentID = id;
	var convertData = formatHandler($('#format').val());
	$.ajax({
		type: "DELETE",
		url: "./Film-REST",
		data: convertData(currentID),
		contentType: $('#format').val(),
		success: function(result) {
			console.log(result);
			filmTable('format', 'result');
		},
		//on error
		error: function(result, status){
			console.log(result + status);
		}
	});
}

function update(film){
	var currentFilm = film.value;
	var id = currentFilm;
	currentID = id;
	var format = document.getElementById("format")
	var formatValue = format.value;
	for (let i = 0; i < allFilms.length; i++) {
		console.log("Film ID:" + allFilms[i].id);
		if (formatValue.includes('json')){
			if (allFilms[i].id == currentID) {
				$("#updateModal").modal("show");
				console.log(allFilms[i].title);
			    document.getElementById('updateTitle').value = allFilms[i].title;
			    document.getElementById('updateYear').value = allFilms[i].year;
			    document.getElementById('updateDirector').value = allFilms[i].director;
			    document.getElementById('updateStars').value = allFilms[i].stars;
	            document.getElementById('updateReview').value = allFilms[i].review;
			    //document.getElementById('updateModal').style.dislay = 'block';
	    	}
	   	} 
	   	else {
	    	for (let j = 0; j < allFilms[i].length; j++) {
				console.log("Film ID:" + allFilms[i][5]);
		        if (allFilms[i][5] === currentID) {
		            $("#updateModal").modal("show");
		            console.log("Film ID:" + allFilms[i][1]);
		            document.getElementById('updateTitle').value = allFilms[i][0];
		            document.getElementById('updateYear').value = allFilms[i][1];
		            document.getElementById('updateDirector').value = allFilms[i][2];
		            document.getElementById('updateStars').value = allFilms[i][3];
		            document.getElementById('updateReview').value = allFilms[i][4];
	          	}
             }
           }
         }
	   }
	


function formatHandler(format) {
	if (format.includes('json')){
		return toJson;
	}
	else if (format.includes('xml')){
		return toXml;
	} 
	else if (format.includes('text')){
		return toText;
	}
}

function toJson(id,title,year,director,stars,review){
	return JSON.stringify({
		"id":id,
		"title":title,
		"year":year,
		"director":director,
		"stars":stars,
		"review":review
	})
}

function toXml(id,title,year,director,stars,review){
	var xmlDocument = '<film>' + 
		'<id>' + id + '</id>' +
		'<title>' + title + '</title>' +
		'<year>' + year + '</year>' +
		'<director>' + director + '</director>' +
		'<stars>' + stars + '</stars>' +
		'<review>' + review + '</review>' +
		'</film>';
		return xmlDocument;
}

function toText(id, title, year, director, stars, review) {
  return `${id}#${title}#${director}#${year}#${stars}#${review}`;
}





function showResponseText(request, resultRegion) {
	if ((request.readyState ==4) && (request.status == 200)) {
		htmlInsert(resultRegion, request.responseText);
	}
}



