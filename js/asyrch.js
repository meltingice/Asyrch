function Asyrch(target){
	this.outputTarget = target;
	this.liveTimeout = null;
	this.engines = {
		google : new Worker('js/engines/google.asyrch.js')
	};
	
	this.init();
}

Asyrch.prototype.init = function(){
	var that = this;
	
	var _onmessage = function(e){
		that.outputResults(e.data);
	}
	var _onerror = function(error){
		throw error;
	}
	
	$.each(this.engines, function(i,val){
		eval("that.engines."+i+".onmessage = _onmessage;");
		eval("that.engines."+i+".onerror = _onerror;");
	});
}

Asyrch.prototype.search = function(data){
	$.each(this.engines, function(i,val){
		val.postMessage(data);
	});
}

Asyrch.prototype.outputResults = function(result){
	$(this.outputTarget).append('<li><a href="'+result.url+'">'+result.title+'</a></li>');
}

Asyrch.prototype.liveSearch = function(input){
	if(this.liveTimeout){
		clearTimeout(this.liveTimeout);
	}
	
	var search = $(input).attr('value');
	var that = this;
	
	this.liveTimeout = setTimeout(function(){
		that.search(search);
		$(that.outputTarget).empty();
	},300);
}