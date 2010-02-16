importScripts('../pollen.js');

onmessage = function(search){
	performSearch(search);
}

function performSearch(search){
	$.ajax.post({
		url:"../../php/search.php",
		data:"engine=bing&query="+search,
		success:function(data){
			formatBingData(data.Web);
		}
	});
}

function formatBingData(data){
	data.Results.forEach(function(data){
		var content = {
			url : data.Url,
			title : data.Title
		};
		
		returnData(content);
	});
}

function returnData(data){
	postMessage(data);
}