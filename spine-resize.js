

//Grab the incoming command-line paramaters...
var paramsFromCommandLine;
paramsFromCommandLine = process.argv;


//Make sure we have exactly the right amount (this could be cleverer..)
if(paramsFromCommandLine.length != 4){
	console.log("Incorrect arguments. 2 arguments needed: \n" + 
		"1 - input-file.json \n"+
		"2 - output directory (in source directory)");
	return;
};

//Get values of input file and output folder..
var inputFile = paramsFromCommandLine[2];
var outputFolder = paramsFromCommandLine[3];

//Hardcoded scale factor to resize everything by...
//Visual asset MUST be scaled (ie. in Photoshop) by exact same amount..
var scaleFactor = 0.7;

var newJSON;

//Ready the file system handling for the incoming json file..
var incomingJSON = require('fs');


//Create a folder based on the the incoming folder name...
incomingJSON.mkdir(outputFolder, null, function(err){
	//But if it already exists, return out..
	if(err){
		if(err == "EEXIST"){
			return;
		}
	}else{
		console.log("Folder didn't exist so it's been created..")
	}
});
	
//Read incoming json file...
incomingJSON.readFile('./'+inputFile, 'utf8', function(err, data){
	//If we can't read the file, trace an error..
	if (err) {
    	return console.log("Couldn't open file!!!!! ERROR: "+err);
	}
	//Otherwise parse incoming json data and pass to 'beginUpdate'..
  	newJSON = JSON.parse(data);
  	beginUpdate(newJSON);
});

//For each of the below keys, pass into 'updateJSONvalue'..
function beginUpdate(json){
	
	updateJSONvalue(json, "length");		
	updateJSONvalue(json, "x");
	updateJSONvalue(json, "y");
	updateJSONvalue(json, "w");
	updateJSONvalue(json, "h");
	updateJSONvalue(json, "width");
	updateJSONvalue(json, "height");
	
	//Once done, create the output json file!
	outputNewJSON(json); 
}

function updateJSONvalue(obj, key){
  	
	//If the incoming item isn't an object (ie. its a bottom-of-the-chain-item), return..
  	if(typeof(obj)!=='object'){
    	return;
	}
	//If the current item is an array...
	if((typeof(obj)==='object') && (obj.constructor===Array)){
		//Go through array indices..
		for(var i = 0; i<obj.length; i++){
			//'propertyIsEnumerable' doesn't count properties in prototype chain (eg. 'length' is a property of some of
			//the incoming objects but also a standard propety of objects and arrays!)..
	  		if(obj[i].propertyIsEnumerable(key)){
	  			//If we find an item has a relevant key (eg. 'x' if we're searching for 'x'):
	  			//Change it by passing it to 'changeValue' method (it gets multiplied by scaleFactor)
	  			obj[i][key] = changeValue(obj[i][key]);
	  		};
	  		//Pass current item back into this function (iterative)..
	  		updateJSONvalue(obj[i], key);	  					
	  	}
	//If the current item is an object rather than an array..
	}else if(typeof(obj)==='object'){
		//Go through all properties..
		for(var i = 0; i<Object.keys(obj).length; i++){
			//If we find a relevant key (eg. 'x' if we're searching for 'x')
			if(obj[Object.keys(obj)[i]].propertyIsEnumerable(key)){
				//Change it by passing it to 'changeValue' method (it gets multiplied by scaleFactor)
				obj[Object.keys(obj)[i]][key] = changeValue(obj[Object.keys(obj)[i]][key]);
	  		};
	  		//Change it by passing it to 'changeValue' method (it gets multiplied by scaleFactor)		
	  		updateJSONvalue(obj[Object.keys(obj)[i]], key);	  					
	  	}  				
  	}   						
};

function changeValue(val, key){
	return Math.round(val * scaleFactor);
};

function outputNewJSON(json){
	//Write new json file... JSON.stringify method has a number passed in to adjust white-space formating..
	//Doesn't really matter but makes it nicer to look at..
	incomingJSON.writeFile('./'+outputFolder+"/"+inputFile, JSON.stringify(json, null, 2), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    }); 
}  		