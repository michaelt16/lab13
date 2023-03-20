/* These additional modules allow us to process URL
 paths as well as read/write files */
 const http = require("http");
 const url = require("url");
 const path = require("path");
 const fs = require("fs"); 

// const server = http.createServer(function(request,response){

//     const filename = "sample.html"
//     fs.readFile(filename, (err,file)=>{
//         if (err){
//             response.writeHead(500,{"Content-Type":"text/html"})
//             response.write("<h1>500 error file not found</h1>")
//         }else{
//             response.writeHead(200,{"Content-Type": "text/html"})
//             response.write(file)
//         }
//         res.end()
//     })



// })

// handles two common HTTP errors
const output404Error = (response) => {
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("<h1>404 Error</h1>\n");
    response.write("Requested file not on this machine\n");
    response.end();
   }
   const output500Error = (response) => {
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("<h1>500 Error</h1>\n");
    response.write("Something went wrong with request\n");
    response.end();
   } 
 // maps file extention to MIME types
const mimeType = {
    '.html': 'text/html',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
   };       
       
// our HTTP server now returns requested files
const server = http.createServer( (request, response) => {
    // get the filename from the URL
    var requestedFile = url.parse(request.url).pathname;
    // now turn that into a file system file name by adding the
    // current local folder path in front of the filename
    const ourPath = process.cwd();
    let filename = path.join(ourPath, requestedFile);
    console.log(filename);
    // check if it exists on the computer
    fs.exists(filename, function(exists) {
    // if it doesn't exist, then return a 404 response
    if (! exists) {
    output404Error(response);
    return;
    }
    // if no file was specified, then return default page
    if (fs.statSync(filename).isDirectory())
    filename += '/index.html';
    // file was specified then read it and send contents
    fs.readFile(filename, "binary", function(err, file) {
    // maybe something went wrong ...
    if (err) {
    output500Error(response, err);
    return;
    }
    // based on the URL path, extract the file extension
    const ext = path.parse(filename).ext;
    // specify the mime type of file via header
    const header = {'Content-type' : mimeType[ext] ||
    'text/plain' };
    response.writeHead(200, header );
    // output the content of file
    response.write(file, "binary");
    response.end();
    });
    });
   }); 
// Listen on port on localhost
let port = 8080;
server.listen(port);
// display a message on the terminal
console.log("Server running at port= " + port);