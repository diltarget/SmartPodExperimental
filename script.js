var events = require('./event.js');
var drivers = require('./driver.js');
var xml2js = require('xml2js');
var fs = require('fs');

var dir=__dirname+'/scripts'; 

var parser = new xml2js.Parser();

exports.load = function(callback){

	drivers.load(function(){
	events.load(function(){
	fs.readdir(dir,function(err,files){
    		if (err) throw err;
    	var c=0;
    	files.forEach(function(file){
		if(file.indexOf(".xml") - file.length == -4)
		{

		fs.readFile(dir+'/'+file,'utf-8',function(err,html){

		parser.parseString(html, function (err, result) {
			console.log(result);
			Object.keys(result).forEach(function(s) {
			result = result[s]
			create_event(s,result['$'],result);
			});
			
		});

		});
			

		}
		else
		{
			return;
		}
        });
	callback();
	});
	});

    });

}

function create_event(event,par, program){

	if(events.exist(event) != true && event != "main") return;
	events.call(event,par, function(r){
	if(typeof r === "undefined") r={};
	Object.keys(program).forEach(function(key) {
		if(key==="$"){ return;}
  		Object.keys(program[key]).forEach(function(val){
			if(typeof program[key][val] != "object") return;
			Object.keys(program[key][val]).forEach(function(m){
				Object.keys(program[key][val][m]).forEach(function(l){
					var p = program[key][val][m][l]['$'];
					Object.keys(p).forEach(function(g){
							
						if(typeof p[g] != "string") return;
						if(p[g].substring(0,1) != "{") return;
						if(p[g].substring(p[g].length-1, p[g].length) != "}") return;
						if(typeof r[p[g].substring(1, p[g].length-1)] === "undefined") return;

						p[g]=r[p[g].substring(1, p[g].length-1)];
					});
					
					drivers.param(key, m,p, function(out){
						console.log("@"+event+": "+out);
					});
				});
			});
		});
	});
	});
}