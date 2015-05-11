//Dylan Thomas 2015
//GNUPLV2

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

var commands;
var events
var eventlist = [];

var parser = new xml2js.Parser();
driver.load(function(){
fs.readFile('main.xml','utf-8',function(err,html){
            	if (err) throw err;
		parser.parseString(html, function (err, result) {
			result=result['main'];
			Object.keys(result).forEach(function(key) {
  				Object.keys(result[key]).forEach(function(val){
					if(typeof result[key][val] != "object") return;
					Object.keys(result[key][val]).forEach(function(m){
					Object.keys(result[key][val][m]).forEach(function(l){
						driver.param(key, m,result[key][val][m][l]['$'], function(out){console.log("@MAIN: "+out);});
					});
					});
				});
			});
		});
	});
});
//schedule.load();

//console.log(driver.param("math","call",{}));

function dbPush(data)
{
	var o = {};
	var tag;
	Object.keys(data).forEach(function(key) {
		if(key != "type" && key != "tag")
		{
			o[key] = data[key];
		}
		else if(key === "tag")
		{
			tag = data["tag"];
		}
	});
	 
	var b = JSON.stringify(o);

	var stamp = Math.floor(Date.now() / 1000);
	db.query("INSERT INTO localdata VALUES ( @s , @t , @data )", {s:stamp, t: tag, data:b});
	
	//stmt.finalize();

	return "success";

}

function call(name)
{

	if(commands[name] != null)
	{

	exe(commands[name], function (error, stdout, stderr) {
	
		return stdout;
	
	});
	
	}

}

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var queryData = url.parse(request.url, true).query;
  response.writeHead(200, {"Content-Type": "text/plain"});
	
	//driver.param("math","add",{a:1,b:2}, function (out){console.log(out+"a");});
	//console.log(driver.param("math","call",{}));

	if (queryData.type) {
    // user told us their name in the GET request, ex: http://host:8000/?name=Tom
   
		if(queryData.type === "call" && queryData.object != null)
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
		else if(queryData.type === "push")
		{
			response.end(dbPush(queryData));
		}
		else if(queryData.type === "query")
		{
		

			if(typeof queryData.tag === 'undefined' && typeof queryData.limit === 'undefined')
			{
				response.end("Provide Valid Parameters");
			}
			else if(isNaN(queryData.limit) == false)
			{
					
				var out = "";

				db.query("SELECT * FROM localdata WHERE tag = @tag ORDER BY time DESC LIMIT @limit",{tag: queryData.tag, limit: queryData.limit},
  					function (err, rows) {
						for(var i = 0; i < rows.length; i++)
						{
							rows[i][0] = parseInt(rows[i][0]);
    						rows[i][2] = JSON.parse(rows[i][2]);
  						}
						response.end(JSON.stringify(rows));
					}
				);

				//response.end(out);

			}
			else
			{

				db.query("SELECT * FROM localdata WHERE tag = @tag ORDER BY time DESC LIMIT 1",{tag: queryData.tag},
  					function (err, rows) {
						rows[0][0] = parseInt(rows[0][0]);
						rows[0][2] = JSON.parse(rows[0][2]);
    					response.end(JSON.stringify(rows));
  					}
				);
			}

		}
		else if(queryData.type === "")
		{
		
		}
		//response.end('Hello ' + queryData.name + '\n');

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
