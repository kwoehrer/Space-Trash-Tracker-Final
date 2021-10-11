//Below is a test to ensure parsing is working.
let dataFile2 =  require("./parsedTLEList.json");

let arrTLE = dataFile2;

for(let i = 0; i < arrTLE.length; i++){
    console.log(arrTLE[i])
  }