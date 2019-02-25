var data = []; // Stores headings of articles
var ranking;

function loadArticle(URL) { // Loads article to be displayed
	
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function() { // async function

		if (this.readyState == 4 && this.status == 200) { // HTTP GET request successful
			var content = JSON.parse(this.responseText);
			var articleNumber = parseInt(URL.replace(/^[^0-9]+/, ''), 10); // Get number from URL
			displayArticle(content, articleNumber);
		} else if (this.status == 404) { // Error 404 - Not found
			var error = "<h1>Error 404</h1>";
			error += "<p>Sorry, this article cannot be found. Please try refreshing the page.</p>";
			document.getElementById("article_container").innerHTML = error;
		} else { // Other errors
			var error = "<h1>Oops!</h1>";
			error += "<p>Sorry, an unknown error has occured. Please try refreshing the page.</p>";
			document.getElementById("article_container").innerHTML = error;
		}
	};
	
	httpRequest.open("GET", URL, true); 
	httpRequest.send(); // Send GET request to function
}

function displayArticle(content, articleNumber) {
	html = "";
	document.title = content.title;
	var body = content.body;

	for (var i in body) {
		switch (body[i].type) { // loop through "body" array in json file
			case "heading":
				html += "<h2>" + body[i].model.text + "</h2>";
				data[articleNumber-1] = body[i].model.text;
				break;
			case "paragraph":
				html += "<p>" + body[i].model.text + "</p>";
				break;
			case "image":
				html += "<img src = \"" + body[i].model.url + "\" class= \"article_image\" alt=\"" + body[i].model.altText + "\" height = \"" + body[i].model.height 
				+ "\" width = \"" + body[i].model.width + "\" >";
				break; 
			case "list":
				if (body[i].model.type == "unordered") {
					html += "<ul>";
					for (var j in body[i].model.items) {
						html += "<li>" + body[i].model.items[j] + "</li>";
					}
					html += "</ul>";
				}
				break;
		}	
	}

	if (articleNumber == 1) {
		var next = articleNumber+1;
		html += "<button type=\"button\" class=\"button button-Next\" onclick=\"loadArticle('data/article-"+next+".json')\">Next article &raquo;</button>";
	} else if (articleNumber == 5) {
		var previous = articleNumber-1;
		html += "<button type=\"button\" class=\"button button-Previous\" onclick=\"loadArticle('data/article-"+previous+".json')\">&laquo; Previous article </button>";
		html += "<button type=\"button\" class=\"button button-Next\" onclick=\"displayRanking()\">Rank articles &raquo;</button>";
	} else {
		var previous = articleNumber-1;
		html += "<button type=\"button\" class=\"button button-Previous\" onclick=\"loadArticle('data/article-"+previous+".json')\">&laquo; Previous article </button>";
		var next = articleNumber+1;
		html += "<button type=\"button\" class=\"button button-Next\" onclick=\"loadArticle('data/article-"+next+".json')\">Next article &raquo;</button>";
	}
	document.getElementById("article_container").innerHTML = html;
}

function displayRanking() {
	document.title = "Article Ranker"
	var html = "";
	html += "<p>We hope you liked the articles. To help us improve, please rank the articles read by dragging from best to worst.</p>"+
			"<ul id =\"sortable\">"+
			"<li class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span><b> Article 1: </b>" + data[0] + "</li>"+
			"<li class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span><b> Article 2: </b>" + data[1] + "</li>"+
			"<li class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span><b> Article 3: </b>" + data[2] + "</li>"+
			"<li class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span><b> Article 4: </b>" + data[3] + "</li>"+
			"<li class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span><b> Article 5: </b>" + data[4] + "</li></ul>"+
			"<button type=\"button\" id=\"submit\" class=\"button button-Next\" onclick=\"sendFeedback()\">Submit Rankings</button>"
	document.getElementById("article_container").innerHTML = html;

	$( function() {
		$( "#sortable" ).sortable({
			stop: function(event, ui) {
				ranking = $(this).sortable('serialize');
			},
			placeholder: "ui-state-highlight"
		});
		$( "#sortable" ).disableSelection();
	} );
}

function sendFeedback() {
	var httpRequest = new XMLHttpRequest();
	
	httpRequest.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) { // HTTP POST request successful
			var error = "<h1>Rankings Submitted!</h1>";
			error += "<p>Thank you for submitting your feedback.</p>";
			document.getElementById("article_container").innerHTML = error;
		} else if (this.status == 404) { // Error 404 - Not found
			var error = "<h1>Error 404</h1>";
			error += "<p>Sorry, this page cannot be found. Please try refreshing the page.</p>";
			document.getElementById("article_container").innerHTML = error;
		} else { // Other errors
			var error = "<h1>Oops!</h1>";
			error += "<p>Sorry, an unknown error has occured. Please try refreshing the page.</p>";
			document.getElementById("article_container").innerHTML = error;
		}
	};

	httpRequest.open('POST', '/rankings.php', true); // PUSH to ranking.php page
	httpRequest.send(ranking);
}