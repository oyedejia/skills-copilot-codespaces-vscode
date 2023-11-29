// Import modules
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

// Create server
http.createServer(function (req, res) {
  // Parse the request containing file name
  var pathname = url.parse(req.url).pathname;
  // Print the name of the file for which the request is made
  console.log("Request for " + pathname + " received.");

  // Read the requested file content from the file system
  var filename = path.join(process.cwd(), pathname);
  fs.readFile(filename, function (err, data) {
    if (err) {
      console.log(err);
      // HTTP Status: 404 : NOT FOUND
      // Content Type: text/plain
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.write('404 Not Found');
    } else {
      // Determine the content type based on the file extension
      var contentType = 'text/html';
      var extname = path.extname(filename);
      switch (extname) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
          contentType = 'image/jpg';
          break;
      }

      // HTTP Status: 200 : OK
      // Content Type: determined dynamically based on file extension
      res.writeHead(200, { 'Content-Type': contentType });
      // Write the content of the file to the response body
      res.write(data);
    }
    // Send the response body
    res.end();
  });
}).listen(8081);

// Console will print the message
console.log('Server running at http://localhost:8081/');
