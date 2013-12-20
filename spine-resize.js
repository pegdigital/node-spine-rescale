

////////////// Run in Node as follows: 
//node spine-resize file1.json file2.json file3.json outputFolderName
//Can handle as many files needed, output folder name must be last param, output folder created inside current folder (where input files are)

//Grab the incoming command-line paramaters...
var paramsFromCommandLine;
paramsFromCommandLine = process.argv;

//Output folder is last parameter..
var outputFolder = paramsFromCommandLine[paramsFromCommandLine.length-1];

//Make new array ready for input files...
var inputFiles = [];

//Create inputFiles array from command line params...
for(var i = 0; i<paramsFromCommandLine.length; i++){
	if(i != 0 && i != 1 && i != paramsFromCommandLine.length-1){
		inputFiles.push(paramsFromCommandLine[i]);
	};
};

//Hardcoded scale factor to resize everything by...
//Visual asset MUST be scaled (ie. in Photoshop) by exact same amount..
var scaleFactor = 0.7;


//Ready the file system handling for the incoming json file..
var incomingJSON = require('fs');
var newJSON;
var currentFile = 0;

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

//Begin going through json files...
handleFile();



function handleFile(){
	//Get current file...
	var currentFileName = inputFiles[currentFile];

	//Read incoming json file...
	incomingJSON.readFile('./'+inputFiles[currentFile], 'utf8', function(err, data){
		//If we can't read the file, trace an error..
		if(err){
	    	return console.log("Couldn't open file!!!!! ERROR: "+err);
		}
		
		//Otherwise parse incoming json data and pass to 'beginUpdate'..
	  	newJSON = JSON.parse(data);
	  	beginUpdate(newJSON);
	  	
	  	//Once done, create the output json file!
		outputNewJSON(newJSON, currentFileName); 

		//Iterate this var and if we're not at the end of the array, do this again.. 
		currentFile++;
		if(currentFile < inputFiles.length){
			handleFile();
		};
	});
}


//For each of the below keys, pass into 'updateJSONvalue'..
function beginUpdate(json){	
	updateJSONvalue(json, "length");		
	updateJSONvalue(json, "x");
	updateJSONvalue(json, "y");
	updateJSONvalue(json, "w");
	updateJSONvalue(json, "h");
	updateJSONvalue(json, "width");
	updateJSONvalue(json, "height");		
};

function updateJSONvalue(obj, key){
  	
	//If the incoming item isn't an object (ie. its a bottom-of-the-chain-item), return..
  	if(typeof(obj)!=='object'){
    	return;
	};
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

function outputNewJSON(json, output){
	
	//Write new json file... JSON.stringify method has a number passed in to adjust white-space formating..
	//Doesn't really matter but makes it nicer to look at..
	incomingJSON.writeFile('./'+outputFolder+"/"+output, JSON.stringify(json, null, 2), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    }); 
}  		