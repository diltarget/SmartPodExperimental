//Mark Goldberg & Dylan Thomas
var dblite = require('dblite');
var db = dblite('drivers/localdata');
var driver = require('../driver.js');

module.exports={
	set: function(i,callback)
	{
		if(typeof i.tag === "undefined") return;
		dbPush(i);
		callback(JSON.stringify(i)+" logged to "+i.tag);
	},
	get: function(i,callback)
	{

		if(typeof i.tag === "undefined") return;
		
		if(typeof i.limit=== "undefined")
		{
			dbQuery(i.tag,1, callback);
		}
		else
		{
			dbQuery(i.tag, i.limit, callback);
		}	
			
	},
	getInterval: function(i,callback)
	{

		if(typeof i.tag === "undefined") return;
		if(typeof i.start === "undefined") return;
		if(typeof i.end === "undefined") return;

		dbQuerySince(i.tag,i.start,i.end,callback);

	},
	delete: function(i, callback)
	{
		if(parseInt(i.since) == NaN) return;
		
		db.query("DELETE FROM localdata WHERE time <= @s", {s:i.since});
		
		callback("success");
	},
	intervalQuery: function(i,callback)
	{
		if(typeof i.interval === "undefined") return;
		if(typeof i.start === "undefined") return;
		if(typeof i.end === "undefined") return;
		if(typeof i.tag === "undefined") return;
		
		var start = parseInt(i.start);
		var end = parseInt(i.end);
		var int = parseInt(i.interval);
		var dif = (end - start)/int;

		var o = {};

		for(var j=1; j <= int; j++)
		{
			console.log(start+(j*dif));
			dbQuerySince(i.tag,start+((j-1)*dif),start+(j*dif),(j-1),function(s,out){
				o[s]=out;
				console.log(out);
				driver.param("datastore","set",{store:i.tag,tag:(s),val:out.replace("\\","")},function(){});
			});

		}

		callback("");


	}

};

function dbPush(data)
{
	var o = {};
	var tag;
	Object.keys(data).forEach(function(key) {
		if(key != "tag")
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

function dbQuery(tag,limit, callback)
{

	db.query("SELECT * FROM localdata WHERE tag = @tag ORDER BY time DESC LIMIT @limit",{tag: tag, limit: limit},
  		function (err, rows) {
			console.log(typeof rows);
			if(rows == null)
			{
				callback(JSON.stringify({}));
				return;
				
			}
			for(var i = 0; i < rows.length; i++)
			{
				rows[i][0] = parseInt(rows[i][0]);
    				rows[i][2] = JSON.parse(rows[i][2]);
  			}
			callback(JSON.stringify(rows));
		}
	);
}

function dbQuerySince(tag,start,end,v, callback)
{

	db.query("SELECT * FROM localdata WHERE tag = @tag AND time >= @start AND time <= @end ORDER BY time DESC LIMIT 1",{tag: tag, end:end, start:start},
  		function (err, rows) {
			console.log(typeof rows);
			if(rows == null)
			{
				callback(JSON.stringify({}));
				return;
				
			}
			for(var i = 0; i < rows.length; i++)
			{
				rows[i][0] = parseInt(rows[i][0]);
    				rows[i][2] = JSON.parse(rows[i][2]);
  			}

			process.nextTick(function(){
				callback(v,JSON.stringify(rows));
			});
		}
	);
}