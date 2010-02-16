importScripts('../pollen.js');

onmessage = function(search){
	performSearch(search);
}

function performSearch(search){
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