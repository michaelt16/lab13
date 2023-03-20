// first reference required modules
const fs = require('fs');
const path = require('path');
const express = require('express'); 


// create an express app
const app = express();
const stocks = require('./scripts/data-provider.js'); 
const stockRouter = require('./scripts/stock-router.js');
stockRouter.handleSingleSymbol(stocks, app);
stockRouter.handleNameSearch(stocks, app); 
stockRouter.handlePriceData(stocks,app)
// tell node to use json and HTTP header features
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/static',
 express.static(__dirname))
let port =8080
app.listen(port,()=>{
    console.log("Server running at port" +port)
})