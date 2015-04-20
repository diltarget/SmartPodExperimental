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
var async = require('async.js');
var parser = new xml2js.Parser();

var driver = require('./driver.js');
var config = require('./config.js');

driver.load();
config.load();

var data={};
var dir=__dirname+'/schedule'; 

exports.load = function(){

	fs.readdir(dir,function(err,files){
    		if (err) throw err;
    	var c=0;
    	files.forEach(function(file){
		if(file.indexOf(".xml") - file.length != -4) return;
        	c++;
		//console.log(file);
        	fs.readFile(dir+'/'+file,'utf-8',function(err,html){
            	if (err) throw err;
		parser.parseString(html, function (err, result) {
			console.log(result.schedule);
			builder(result.schedule);
		});
        });
    });
});

config.load();

}

function builder(list)
{
	console.log("hello");
	async.each(list.timer, function(value, callback){
	console.log(value);
		if(value['$']===undefined) callback();
		if(value['$'].interval===undefined) callback();
		setTimeout(function(){console.log(value['$'].interval)},10000);
		console.log("are you");
		setInterval(function(){
			console.log("okay");
			if(value.nolog != undefined) async.each(value.nolog, function(nolog, callback){
				Object.keys(nolog).forEach(function(key){
					for(var i = 0; i < nolog[key].length; i++)
					{
						if(nolog[key][i]['$']===undefined) return false;
						if(nolog[key][i]['$'].call===undefined) return false;
						var p = nolog[key][i]['$']
						delete p.call
						console.log("Stuff");
						driver.param(key,nolog[key][i]['$'].call,p, function(out){
							console.log("good");
							console.log(out);
						});
						
					}
				});
			},function(err){});

			if(value.log != undefined) async.each(value.log, function(log, callback){
				
				if(log['$'] === undefined){
					var tag="";
					var o = {};
					var c = 0;
					object.keys(log).forEach(function(key){
						c++;
						if(key != "tag")
						{
							
							var dro;
							var obj;
							object.keys(log[key][0]).forEach(function(k){
								dro=log[key][0][k];
								obj=k;
							});

							if(dro[0]['$']===undefined) return;
							if(dro[0]['$'].call===undefined) return;

							//o[key] = log[key];
							var p = dro[0]['$']
							delete p.call

							driver.param(obj,dro[0]['$'].call,p, function(out){
								o[key]=out;
								c--;
							});
  
						}
						else if(key === "tag")
						{
							tag = data["tag"];
							c--;						
						}

					});

					while(c!=0){}
					var b = JSON.stringify(o);
					var stamp = Math.floor(Date.now() / 1000);
					db.query("INSERT INTO localdata VALUES ( @s , @t , @data )", {s:stamp, t: tag, data:b});
					
				}
				/*var tag="";
				var o = {};
				
				Object.keys(log['$']*/
				//TODO allow for config log
				
			},function(err){});					

		}, value['$'].interval);

	},function(err){});

	async.each(list.date, function(value, callback){

		if(value['$']===undefined) callback();
		
		schedule.scheduleJob(value['$'],function(){

			if(value.nolog != undefined) async.each(value.nolog, function(nolog, callback){
				Object.keys(nolog).forEach(function(key){
					for(var i = 0; i < nolog[key].length; i++)
					{
						if(nolog[key][i]['$']===undefined) return false;
						if(nolog[key][i]['$'].call===undefined) return false;
						var p = nolog[key][i]['$']
						delete p.call
						
						driver.param(key,nolog[key][i]['$'].call,p, function(out){

							console.log(out);
						});
						
					}
				});
			},function(err){});

			if(value.log != undefined) async.each(value.log, function(log, callback){
				
				if(log['$'] === undefined){
					var tag="";
					var o = {};
					var c = 0;
					object.keys(log).forEach(function(key){
						c++;
						if(key != "tag")
						{
							
							var dro;
							var obj;
							object.keys(log[key][0]).forEach(function(k){
								dro=log[key][0][k];
								obj=k;
							});

							if(dro[0]['$']===undefined) return;
							if(dro[0]['$'].call===undefined) return;

							//o[key] = log[key];
							var p = dro[0]['$']
							delete p.call

							driver.param(obj,dro[0]['$'].call,p, function(out){
								o[key]=out;
								c--;
							});
  
						}
						else if(key === "tag")
						{
							tag = data["tag"];
							c--;						
						}

					});

					while(c!=0){}
					var b = JSON.stringify(o);
					var stamp = Math.floor(Date.now() / 1000);
					db.query("INSERT INTO localdata VALUES ( @s , @t , @data )", {s:stamp, t: tag, data:b});
					
				}
				/*var tag="";
				var o = {};
				
				Object.keys(log['$']
				//TODO allow for config log*/
				
			},function(err){});					

		});

	},function(err){});

}
