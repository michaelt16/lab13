const fetch = require('node-fetch')
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
   `http://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.ph
   p?symbol=${symbol}`;
   
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
    const stock = stocks.filter(obj => symbolToFind ===obj.symbol);
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