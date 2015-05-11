var driver = require('../driver.js');
driver.load(function(){

});

module.exports={
	add: function(i,callback){
		driver.param("math","add",i,callback);
	}
};

