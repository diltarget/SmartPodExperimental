//Mark Goldberg & Dylan Thomas
var store = {};
module.exports={
	set: function(i,callback)
	{
		store[i.store][i.tag]=i.val;
		callback(i.val+" logged to "+i.store+" "+i.tag);
	}
	,
	get: function(i,callback)
	{
		callback(store[i.store][i.tag]);
	}
};