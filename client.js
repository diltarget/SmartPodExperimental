//Dylan Thomas 2015
//GNUPLV3

var dblite = require('dblite');
var db = dblite('localdata');
var http = require('http');
var url = require('url');
var fs = require('fs');
var xml2js = require('xml2js');
var exec = require('child_process').exec;
//var schedule = require('node-schedule');
var driver = require('./driver.js');
//var schedule = require('./schedule.js');
var scripts = require('./script.js');

scripts.load(function(){});

driver.load(function(){});

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var queryData = url.parse(request.url, true).query;
  response.writeHead(200, {"Content-Type": "text/plain"});
   
	if(queryData.object != null)
	{
			

		if(queryData.call == "new")
		{
			driver.new(queryData[key],function(out){response.end(out)});
		}
		else if(queryData.call == undefined)
		{
			driver.param(queryData.object, "call", o, function(out){response.end(out)});
		}
		else
		{
			var o = {};

			Object.keys(queryData).forEach(function(key) {
				if(key != "type" && key != "object" && key != "call")
				{
					o[key] = queryData[key];
				}
			});
 
	
			driver.param(queryData.object, queryData.call, o, function(out){response.end(out);console.log(out);});
		}
		

	}
	else if (queryData.ping)
	{
		response.end('pong');
	}
	else {
    		response.end("Provide Valid Parameters");
  	}
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);
