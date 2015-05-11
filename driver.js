//Dylan Thomas 2015
//GNUPLV2

var dblite = require('dblite');
var db = dblite('localdata');
var http = require('http');
var url = require('url');
var fs = require('fs');
var xml2js = require('xml2js');
var exec = require('child_process').exec;
var schedule = require('node-schedule');
var parser = new xml2js.Parser();
var config = require('./config.js');

var data={};
var dir=__dirname+'/drivers'; 

exports.load = function(callback){

	fs.readdir(dir,function(err,files){
    		if (err) throw err;
    	var c=0;
    	files.forEach(function(file){
		if(file.indexOf(".xml") - file.length == -4)
		{
        	c++;
		//console.log(file);
        	fs.readFile(dir+'/'+file,'utf-8',function(err,html){
            	if (err) throw err;
		parser.parseString(html, function (err, result) {
			Object.keys(result).forEach(function(key) {
  				data[key]=result[key];
  				console.log(key);
			});
		});
		});
		}
		else if(file.indexOf(".js") - file.length == -3)
		{
        	
  				data[file.substring(0,file.length-3)]=require('./drivers/'+file);
  				console.log(file.substring(0,file.length-3));

		
		}
		else
		{
			return;
		}
        });

console.log("hello");
config.load(callback);

    });

}

exports.param = function(object,func, param, callback){

	if(data[object]===undefined) return false;
	if(data[object][func]===undefined) return false;	

	if(typeof data[object][func] === "function")
	{

		data[object][func](param,callback);
		return;

	}

	var command="";

	if(typeof data[object][func][0] != "string"){
		command=data[object][func][0]['_'];

		Object.keys(data[object][func][0]['$']).forEach(function(key){
			if(data[object][func][0]['$'][key]==="var")
			{
				command = command.replace(new RegExp("{"+key+"}","g"), param[key]);
			}
			else if(data[object][func][0]['$'][key]==="config")
			{
				command = command.replace(new RegExp("{"+key+"}","g"), config.get(object,param[key]));
			}
			else if(data[object][func][0]['$'][key]==="all")
			{
				command = command.replace(new RegExp("{"+key+"}","g"), "{all}");
			}
			else if(data[object][func][0]['$'][key]==="name")
			{
				command = command.replace(new RegExp("{"+key+"}","g"), "{name}");
			}
		});
	}
	else{
		command=data[object][func][0];
	}


	if(command.indexOf("{all}")<0){
		
		exec(command, function (error, stdout, stderr) {
		
			callback(stdout);
			
		});
	}
	else
	{
		var list = config.list(object);
		Object.keys(list).forEach(function(key){
			var ctemp=command.replace(new RegExp("{all}","g"),list[key]);
			ctemp=ctemp.replace(new RegExp("{name}","g"),key);
			exec(ctemp, function (error, stdout, stderr) {
				//console.log(stdout);
				callback(stdout);

			});
		});

	}

}

exports.new = function(object, callback){

	if(data[object]===undefined) return false;
	if(data[object]["new"]===undefined) return false;
	var command="";

	command=+data[object]["new"][0];
	
	exec(command, function (error, stdout, stderr) {
		
		callback(stdout);
		
	});


}

function build(command, callback)
{



}
