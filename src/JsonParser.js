let dataFile = require('../src/fullCatGP.json');
const fs = require('fs');

let satNameArr =[];

//This code pushes the first 7000 objects on the json to the visualizer. From our query we could access more but loading time stalls out at 7000+.
for(let i = 0; i < dataFile.length; i++){
  var json = JSON.stringify(dataFile[i]);
  var totalTLE = JSON.parse(json).TLE_LINE0 + "\n "+ JSON.parse(json).OBJECT_TYPE + "\n"+ JSON.parse(json).TLE_LINE1 + "\n" + JSON.parse(json).TLE_LINE2;
  satNameArr.push(totalTLE);
}

fs.writeFile('../src/parsedTLEList.json', JSON.stringify(satNameArr), err => {
  if (err) {
    console.error(err)
    return
  }
});