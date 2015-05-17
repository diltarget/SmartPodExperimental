var fs = require('fs');
//var schedule = require('node-schedule');
var driver = require('./driver.js');
//var schedule = require('./schedule.js');

var commands;
var events = {};

var dir=__dirname+'/events'; 

//var parser = new xml2js.Parser();

exports.load = function(callback){
fs.readdir(dir,function(err,files){
    		if (err) throw err;
    	var c=0;
    	files.forEach(function(file){
		if(file.indexOf(".js") - file.length == -3)
		{
        	
  			events[file.substring(0,file.length-3)]=require('./events/'+file);
  			console.log(file.substring(0,file.length-3));

		
		}
		else
		{
			return;
		}
        });

	callback();

    });
}

exports.exist = function(event){

if(typeof events[event] === "undefined") return false;

return true;
}

exports.call = function(event, par, callback){

	if(event === "main"){ callback(); return;}
	if(typeof events[event] === "undefinied") return;

	events[event].event(par,callback);

}