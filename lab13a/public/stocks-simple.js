// first reference required modules
const fs = require('fs');
const path = require('path');
const express = require('express'); 

// for now, we will get our data by reading the provided json file
const jsonPath = path.join(__dirname, 
 'stocks-simple.json');
const jsonData = fs.readFileSync(jsonPath, 'utf8');
// convert string data into JSON object
const stocks = JSON.parse(jsonData);

// create an express app
const app = express();

// tell node to use json and HTTP header features
app.use(express.json());
app.use(express.urlencoded({extended: true}));


let port =8080
app.listen(port,()=>{
    console.log("Server running at port" +port)
})