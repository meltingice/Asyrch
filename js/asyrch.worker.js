importScripts('pollen.js');

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
		url:"../php/search.php",
		data:"engine=google&query="+search,
		success:function(data){
			formatGoogleData(data.json);
		}
	});
}

function formatGoogleData(data){
	$.each(data.responseData,function(i,val){
		returnData(val.results);
	});
}

function returnData(data){
	postMessage(data);
}