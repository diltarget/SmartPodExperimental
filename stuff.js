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

var commands;
var events
var eventlist = [];

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/live.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(result);
        console.log('Done');
		commands = result.commands;

    });
});

/*fs.readFile(__dirname + '/schedule.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(JSON.stringify(result));
        console.log('Done');
		events = result.events;

		for(var v = 0; v < events.timer.length; v++)
		{
			console.log(v);
			setInterval(function() {
				//console.log("MAN");
				
        		
				for(var j = 0; j < events.timer[v].nolog.length; j++)
				{
					if(typeof commands[events.timer[v].nolog[j]] != 'undefined')
					{

						//console.log("MAN");
						exec(commands[events.timer[v].nolog[j]], function (error, stdout, stderr) {
							
							//console.log(stdout);
						});
	
					}
				}

				if(events.timer[v].tag != null)
				{
					//console.log("MAN");
					var dbdata;
										

					for(var k = 0; k < events.timer[v].log.length; k++)
					{

						exec(commands[events.timer[v].log[k]._], function (error, stdout, stderr) {
							dbdata[events.timer[v].log[k].$.value] = stdout;
							
						});

					}

					var b = JSON.stringify(o);

					var stamp = Math.floor(Date.now() / 1000);
					db.query("INSERT INTO localdata VALUES ( @s , @t , @data )", {s:stamp, t: evets.timer[v].tag, data:dbdata});

				}

    		}, events.timer[v].$.interval);
	
		}

		for(var v = 0; v < events.date.length; v++)
		{
	
			schedule.scheduleJob(events.date[v].$, function() {
        		
				for(var j = 0; j < events.date[v].nolog.length; j++)
				{
					if(commands[events.date[v].nolog[j]] != null)
					{
						exec(commands[events.date[v].nolog[j]], function (error, stdout, stderr) {
							
	
						});
	
					}
				}

				if(events.date[v].tag != null)
				{

					var dbdata;
										

					for(var k = 0; k < events.date[v].log.length; k++)
					{

						exec(commands[events.date[v].log[k]._], function (error, stdout, stderr) {
							dbdata[events.date[v].log[k].$.value] = stdout;
							
						});

					}

					var b = JSON.stringify(o);

					var stamp = Math.floor(Date.now() / 1000);
					db.query("INSERT INTO localdata VALUES ( @s , @t , @data )", {s:stamp, t: evets.date[v].tag, data:dbdata});

				}

    		});
	
		}
		
    });

});*/

setInterval(function(){

	var dbdata;			
	var list = [["temp","gettemp"]];
	var tag = "record";						

	for(var k = 0; k < list.length ; k++)
	{
		exec(commands[list[k][1]], function (error, stdout, stderr) {
			dbdata[list[k][0]] = stdout;
							
		});

	}
	var b = JSON.stringify(o);

	var stamp = Math.floor(Date.now() / 1000);
	db.query("INSERT INTO localdata VALUES ( @s , @t , @data )", {s:stamp, t: evets.date[v].tag, data:dbdata});

}, 5000);

//db.run("CREATE TABLE localdata (time INTEGER, tag TEXT, data TEXT)");

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
	
	if (queryData.type) {
    // user told us their name in the GET request, ex: http://host:8000/?name=Tom
   
		if(queryData.type === "live")
		{
			console.log("MAN");
			//response.end(call(queryData.call));

			if(commands[queryData.call] != null)
			{
				exec(commands[queryData.call], function (error, stdout, stderr) {
					response.end(stdout) ;
	
				});
	
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
