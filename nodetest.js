


var paramsFromCommandLine;
paramsFromCommandLine = process.argv;



if(paramsFromCommandLine.length != 4){
	console.log("Incorrect arguments. 2 arguments needed: \n" + 
		"1 - input-file.json \n"+
		"2 - output directory (in source directory)");
	return;
};

var inputFile = paramsFromCommandLine[2];
var outputFolder = paramsFromCommandLine[3];


var scaleFactor = 0.706;

var newJSON;

var incomingJSON = require('fs');

if(!incomingJSON.exists(outputFolder)){
	console.log("Folder didn't exist so creating it..");
	incomingJSON.mkdir(outputFolder);
	
}
incomingJSON.readFile('./'+inputFile, 'utf8', function(err, data){
	if (err) {
    	return console.log("Couldn't open file!!!!! ERROR: "+err);
	}
  	newJSON = JSON.parse(data);
  	beginUpdate(newJSON);
});


function beginUpdate(json){
	
	updateJSONvalue(json, "length");		
	updateJSONvalue(json, "x");
	updateJSONvalue(json, "y");
	updateJSONvalue(json, "w");
	updateJSONvalue(json, "h");
	updateJSONvalue(json, "width");
	updateJSONvalue(json, "height");
	

	outputNewJSON(json); 
}

function updateJSONvalue(obj, key){
  	
	
  	if(typeof(obj)!=='object'){
    	return;
	}
	
	if((typeof(obj)==='object') && (obj.constructor===Array)){
		for(var i = 0; i<obj.length; i++){
	  			
	  		if(obj[i][key]){
	  			console.log("Found..", key, obj[i])
	  			obj[i][key] = changeValue(obj[i][key]);
	  		};

	  		updateJSONvalue(obj[i], key);	  					
	  	}
	}else if(typeof(obj)==='object'){
	
		for(var i = 0; i<Object.keys(obj).length; i++){
			if(obj[Object.keys(obj)[i]][key]){
				console.log("Found..", key, obj[Object.keys(obj)[i]])
				obj[Object.keys(obj)[i]][key] = changeValue(obj[Object.keys(obj)[i]][key]);
	  		};
	  				
	  		updateJSONvalue(obj[Object.keys(obj)[i]], key);	  					
	  	}  				
  	}   						
};

function changeValue(val){
	return Math.round(val * scaleFactor);
};

function outputNewJSON(json){
	
	incomingJSON.writeFile('./'+outputFolder+"/"+inputFile, JSON.stringify(json, null, 2), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    }); 
}  		