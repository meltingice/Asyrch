importScripts('../pollen.js');

onmessage = function(e){
	var search = e.data;
	if(search.length == 0){
		throw "Empty search queries not allowed";
	}
	
	doSearch(search);
}

function doSearch(search){
	googleSearch(search);
}

function googleSearch(search){
	$.ajax.post({
		url:"../../php/search.php",
		data:"engine=google&query="+search,
		success:function(data){
			formatGoogleData(data.json);
		}
	});
}

function formatGoogleData(data){
	data.responseData.results.forEach(function(data){
		var content = {
			url : data.url,
			title : data.titleNoFormatting
		};
		
		returnData(content);
	});
}

function returnData(data){
	postMessage(data);
}