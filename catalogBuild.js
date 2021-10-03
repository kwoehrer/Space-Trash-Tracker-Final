var cat = "./catalog.txt";

//Below = Problem Child
var fs = require('fs');
//Above = Problem Child. Replace require?? 

const datArr = fs.readFileSync(cat).toString().split(/\n/);
const newDatArr = [];
const finDat=[];
for(let i = 0;i<=datArr.length;i++){
    if(i%3==0){
        continue;
    }else{
        newDatArr.push(datArr[i]);
    }
}

for(let i = 0;i<newDatArr.length;i+=2){
    finDat.push(newDatArr[i] +"\n" +newDatArr[i+1]);
}


 // Sample TLE

export {finDat}