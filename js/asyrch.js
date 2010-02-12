function asyrch(target){
	this.outputTarget = target;
	this.engine = new Worker('js/asyrch.worker.js');
	
	this.init();
}

asyrch.prototype.init = function(){
	var that = this;
	this.engine.onmessage = function(e){
		that.outputResults(e.data);
	}
	this.engine.onerror = function(error){
		throw error;
	}
}

asyrch.prototype.search = function(data){
	this.engine.postMessage(data);
}

asyrch.prototype.outputResults = function(result){
	
}