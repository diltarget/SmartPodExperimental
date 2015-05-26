//Mark Goldberg & Dylan Thomas
var store = {};
module.exports={
	set: function(i,callback)
	{
		if(typeof i.store === "undefined" || typeof i.tag === "undefined" || typeof i.val === "undefined"){
			callback("");
			return;
		}
		if(typeof store[i.store] === "undefined") store[i.store]={};
		store[i.store][i.tag]=i.val;
		callback(i.val+" logged to "+i.store+" "+i.tag);
	}
	,
	get: function(i,callback)
	{
		if(typeof i.store === "undefined" || typeof i.tag === "undefined"){
			callback("");
			return;
		}

		if(typeof store[i.store] === "undefined") return;
		if(typeof store[i.store][i.tag] === "undefined") return;

		callback(""+store[i.store][i.tag]);
	},
	getStore: function(i,callback)
	{
		if(typeof i.store === "undefined"){
			callback("");
			return;
		}

		if(typeof store[i.store] === "undefined") return;

		callback(store[i.store]);
	}
	
};