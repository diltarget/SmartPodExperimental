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

var data={};
var dir=__dirname+'/drivers/config'; 

exports.load = function(){

	fs.readdir(dir,function(err,files){
    		if (err) throw err;
    	var c=0;
    	files.forEach(function(file){
		if(file.indexOf(".json") < 0) return;
        	c++;
		//console.log(file);
        	fs.readFile(dir+'/'+file,'utf-8',function(err,html){
            	if (err) throw err;
		data[file.replace(".json","")]=JSON.parse(html);
		console.log(data);
        });
    });
});
}

function writeFile(object)
{

	fs.writeFile(dir+'/'+object+".json", JSON.stringify(data[object]), function(err){ console.log(err);});

}

exports.set = function(object,property,value){

	if(data[object]===undefined) return false;

	data[object][property]=value;

	writeFile(object);
}

exports.remove = function(object,property){

	if(data[object]===undefined) return false;

	delete data[object][property];

	writeFile(object);
}

exports.get = function(object,property){

	if(data[object]===undefined) return false;

	return data[object][property];
}

exports.list = function(object){

	if(data[object]===undefined) return false;

	return data[object];
}

