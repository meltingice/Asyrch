function Asyrch(target){
	this.outputTarget = target;
	this.liveTimeout = null;
	this.worker = new Worker('js/worker.asyrch.js');
	
	this.init();
}

Asyrch.prototype.init = function(){
	var that = this;
	this.worker.onmessage = function(e){
		that.outputResults(e.data);
	}
	this.worker.onerror = function(error){
		throw error;
	}
}

Asyrch.prototype.search = function(data){
	this.worker.postMessage(data);
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