importScripts('pollen.js');

var engines = {
	google : new Worker('engines/google.engine.js'),
	bing : new Worker('engines/bing.engine.js')
};

onmessage = function(e){
	var search = e.data;
	if(search.length == 0){
		throw "Empty search queries not allowed";
	}
	
	init(search);
}

function init(search){
	var _onmessage = function(e){
		returnData(e.data);
	}
	var _onerror = function(error){
		throw error;
	}
	
	$.each(engines, function(val, i){
		//eval("engines."+i+".onmessage = _onmessage;");
		//eval("engines."+i+".onerror = _onerror;");
		val.onmessage = _onmessage;
		val.onerror = _onerror;
	});
	
	doSearch(search);
}

function doSearch(search){
	$.each(engines, function(engine, i){
		engine.postMessage(search);
	});
}

function returnData(data){
	postMessage(data);
}