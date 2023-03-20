const fetch = require('node-fetch')
const _ = require('lodash'); 
/* Module for handling specific requests/routes for stock data */
// return all the stocks when a root request arrives
const handleAllStocks = (stocks, app) => {
    app.route('/').get((req,res)=>{res.json(stocks)})
};
// return just the requested stock
const handleSingleSymbol = (stocks, app) => {

    app.get('/stock/:symbol', (req,resp) => {
    // change user supplied symbol to upper case
    const symbolToFind = req.params.symbol.toUpperCase();
    // search the array of objects for a match
    const matches =
    stocks.filter(obj => symbolToFind === obj.symbol);
    if (matches.length > 0) {
        resp.json(matches);
        } else {
        resp.json(jsonMessage(`Symbol ${symbolToFind} not found`));
        } 
   }); 
   
    app.put('/stock/:symbol', (req,resp) => {
    const symbolToUpd = req.params.symbol.toUpperCase();
    // use lodash to find index for stock with this symbol
    let indx = _.findIndex(stocks, ['symbol', symbolToUpd]);
    // if didn't find it, then return message
    if (indx < 0) {
    resp.json(jsonMessage(`${symbolToUpd} not found`));
    } else {
    // symbol found, so replace its value with form values
    console.log(req.body)
    stocks[indx].name = req.body.company;
    stocks[indx].sector = req.body.sector;
    stocks[indx].subindustry = req.body.subindustry;
    stocks[indx].address = req.body.address;
    stocks[indx].exchange = req.body.exchange;
    // let requestor know it worked
    resp.json(jsonMessage(`${symbolToUpd} updated`));
    }
    });


};
// return all the stocks whose name contains the supplied text
const handleNameSearch = (stocks, app) => {
    app.get('/stock/name/:substring', (req,resp) => {
        // change user supplied substring to lower case
        const substring = req.params.substring.toLowerCase();
        // search the array of objects for a match
        const matches = stocks.filter( (obj) =>
        obj.name.toLowerCase().includes(substring) );
       // return the matching stocks
       if (matches.length > 0) {
        resp.json(matches);
        } else {
        resp.json(jsonMessage(
        `No symbol matches found for ${substring}`));
        } 
       }); 
};

const jsonMessage = (msg) => {
    return { message : msg };
}; 
async function retrievePriceData(symbol, resp) {
    const url =
   `http://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=${symbol}`;
   
    // retrieve the response then the json
    const response = await fetch(url);
    const prices = await response.json();
    // return the retrieved price data
    resp.json(prices);
}

const handlePriceData = (stocks, app) => {
    app.get('/stock/daily/:symbol', (req,resp) => {
    // change user supplied symbol to upper case
    const symbolToFind = req.params.symbol.toUpperCase();
    // search the array of objects for a match
    const stock = stocks.filter(obj => symbolToFind ===
   obj.symbol);
    // now get the daily price data
    if (stock.length > 0) {
    retrievePriceData(symbolToFind, resp);
    } else {
    resp.json(jsonMessage(`Symbol ${symbolToFind} not
   found`));
    }
    });
   } 

module.exports = {
 handleAllStocks,
 handleSingleSymbol,
 handleNameSearch,
 handlePriceData
};