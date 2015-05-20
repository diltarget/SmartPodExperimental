//Mark Goldberg & Dylan Thomas
var dblite = require('dblite');
var db = dblite('localdata');


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
	delete: function(i, callback)
	{
		if(parseInt(i.since) == NaN) return;
		
		db.query("DELETE FROM localdata WHERE time <= @s", {s:i.since});
		
		callback("success");
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
						for(var i = 0; i < rows.length; i++)
						{
							rows[i][0] = parseInt(rows[i][0]);
    						rows[i][2] = JSON.parse(rows[i][2]);
  						}
						callback(JSON.stringify(rows));
					}
				);
}