module.exports={
	event: function(o,callback){
		if(typeof callback != "function" ) return;
		if(typeof o === "undefined") return;
		if(typeof o.interval === "undefined") return;
		if(typeof parseInt(o.interval) === NaN) return;
		
		setInterval(function(){callback()},parseInt(o.interval));

	}
};