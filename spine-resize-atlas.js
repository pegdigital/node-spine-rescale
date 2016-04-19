

////////////// Run in Node as follows: 
//node spine-resize-atlas file1.json file2.json file3.json outputFolderName
//Can handle as many files needed, output folder name must be last param, output folder created inside current folder (where input files are)

//Grab the incoming command-line paramaters...
var paramsFromCommandLine;
paramsFromCommandLine = process.argv;

//Output folder is last parameter..
var outputFolder = paramsFromCommandLine[paramsFromCommandLine.length-1];

//Make new array ready for input files...
var inputFiles = [];

var currentNewFile = "";
var currentFileName;

//Create inputFiles array from command line params...
for(var i = 0; i<paramsFromCommandLine.length; i++){
	if(i != 0 && i != 1 && i != paramsFromCommandLine.length-1){
		inputFiles.push(paramsFromCommandLine[i]);
	};
};

//Hardcoded scale factor to resize everything by...
//Visual asset MUST be scaled (ie. in Photoshop) by exact same amount..
//var scaleFactor = 0.704;
var scaleFactor = 0.5;

//Ready the file system handling for the incoming json file..
var incomingFile = require('fs');
var newJSON;
var currentFile = 0;

var readline = require('readline');

//Create a folder based on the the incoming folder name...
incomingFile.mkdir(outputFolder, null, function(err){
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
	currentFileName = inputFiles[currentFile];
	
	readline.createInterface({
    	input: incomingFile.createReadStream(currentFileName),
    	terminal: false
	}).on('line', function(line) {
   		var lineHasNumberReg = /\d+/g;
		var lineHasNumber = lineHasNumberReg.test(line);
		
		var lineHasColonReg = /[:]/g;
		var lineHasColon = lineHasColonReg.test(line);
		
		var lineHasCommaReg = /[,]/g;
		var lineHasComma = lineHasCommaReg.test(line);
		
		if(lineHasNumber && lineHasColon && lineHasComma){
			replaceLine(line)
		}else{
			keepLine(line)
		}
	
	}).on('close', function () {
    	
		outputNewFile(currentNewFile, currentFileName);
		
		//Iterate this var and if we're not at the end of the array, do this again.. 
		currentFile++;
		if(currentFile < inputFiles.length){
			handleFile();
		};
  	});
	
	
	
}
//Mickey mouse but works for required format...
function replaceLine(line){
	var regEx = /\d+/g;
	var result = line.match(regEx);
	
	var newLine = line;
	
	//Replace matched strings with unique IDs..
	/*for(var i = 0; i < result.length; i++){	
		newLine = newLine.replace(result[i], String(i)+"STRING ID");	
	}	
	
	//Replace unique IDs with new result (this 2 stage process stops mixing up matched strings from first and second result)
	for(var i = 0; i < result.length; i++){	
		newLine = newLine.replace(String(i)+"STRING ID", Math.round(result[i] * scaleFactor));
		//newLine = newLine.replace(result[i], result[i] * scaleFactor);	
		//console.log("OK found this part!..", result[i], "replacing with..", result[i] * scaleFactor, newLine)	
	}*/	
	
	//Replace matched strings with unique IDs..
	for(var i = 0; i < result.length; i++){	
		if(i == 0){
			newLine = newLine.replace(result[0], "aaa");
		}else if(i == 1){
			newLine = newLine.replace(result[1], "bbb");
		}
			
	}	
	
	//Replace unique IDs with new result (this 2 stage process stops mixing up matched strings from first and second result)
	for(var i = 0; i < result.length; i++){	
		if(i == 0){
			newLine = newLine.replace("aaa", Math.round(result[0] * scaleFactor));
		}else if(i == 1){
			newLine = newLine.replace("bbb", Math.round(result[1] * scaleFactor));
		}
		
	}	
	
	//console.log("new line!", newLine)
	
	currentNewFile = currentNewFile.concat(newLine + "\n")
}

function keepLine(line){
	//console.log("kept line", line)
	
	currentNewFile = currentNewFile.concat(line + "\n")
}

function outputNewFile(string, output){
	var fs = require('fs');
	fs.writeFile('./'+outputFolder+"/"+output, currentNewFile, function(err) {
    	if(err) {
        	return console.log(err);
    	} else {
            console.log("The file was saved!");
        }    
	});	
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}