function serverLaunch(){

  var http = http.js
  var fs = fs.js

  const PORT=8080; 

  fs.readFile('../public/index.html', function (err, html) {

      if (err) throw err;    

      http.createServer(function(request, response) {  
          response.writeHeader(200, {"Content-Type": "text/html"});  
          response.write(html);  
          response.end();  
      }).listen(PORT);
  });
}