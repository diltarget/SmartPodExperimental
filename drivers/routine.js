var script = require('..//script.js')

module.exports={
	call: function(i,callback)
	{
		if(typeof i.routine === "undefined"){
			callback("");
			return;
		}

		script.call(i.routine,i,callback);
		
	}
	
};