// Entry Point of the API Server 
  
const express = require('express');
  
/* Creates an Express application. 
   The express() function is a top-level 
   function exported by the express module.
*/
const app = express();

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "redacted",
  database: "spaceTrash"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO trash (TLE) VALUES ?";
  var values = parseJunk();

  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });
});
  
function parseJunk(){
  var cat = "./catalog.txt";

  //Below = Problem Child
  var fs = require('fs');
  //Above = Problem Child. Replace require?? 

  const datArr = fs.readFileSync(cat).toString().split(/\n/);
  const newDatArr = [];
  const finDat = [];
  for (let i = 0; i <= datArr.length; i++) {
    if (i % 3 == 0) {
      continue;
    } else {
      newDatArr.push(datArr[i]);
    }

    return datArr;
  }

  for (let i = 0; i < newDatArr.length; i += 2) {
    finDat.push(newDatArr[i] + "\n" + newDatArr[i + 1]);
  }

  return finDat;

}
  
/* To handle the HTTP Methods Body Parser 
   is used, Generally used to extract the 
   entire body portion of an incoming 
   request stream and exposes it on req.body 
*/
const express = require('express');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
  
  
pool.connect((err, client, release) => {
    if (err) {
        return console.error(
            'Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
        release()
        if (err) {
            return console.error(
                'Error executing query', err.stack)
        }
        console.log("Connected to Database !")
    })
})
  
app.get('/getTLE', (req, res, next) => {
    console.log("DATA :");
    pool.query('use spaceTrash; Select * from TLE')
        .then(testData => {
            console.log(testData);
            res.send(testData.rows);
        })
})
  
// Require the Routes API  
// Create a Server and run it on the port 3000
const server = app.listen(5000, function () {
    let host = server.address().address
    let port = server.address().port
    // Starting the Server at the port 3000
})
