var PORT = process.env.PORT || 8080;        // set our port

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

let BTCBalance = 23.45;
let ETHBalance = 104.09;


// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// Send json
// router.get('/', (req, res) => {
//     res.json({ message: 'Test' });
// });

var cardAuthenticated = false;
var imageAuthenticated = false;
var fingerprintAuthenticated = false;

var sellBitcoin = false;
var sellBitcoinValue = 0;

var buyETH = false;
var buyETHValue = 0;

router.get('/getWallet', (req, res) => {
    // reset();
    console.log('/getWallet');
    const body = {
        bitcoin: BTCBalance
    };
    res.send(JSON.stringify(body));
});

router.put('/sellbtc', (req, res) => {
    reset();
    console.log('/sellbtc');
    if (!req.body) return res.sendStatus(400)
    sellBitcoinValue = parseFloat(req.body.amount);
    console.log('BTC:', sellBitcoinValue);
    sellBitcoin = true;
    res.send();
});

router.put('/buyeth', (req, res) => {
    reset();
    console.log('/buyeth');
    if (!req.body) return res.sendStatus(400)
    buyETHValue = req.body.amount;
    console.log('ETH:', buyETHValue);
    buyETH = true;
    res.send();
});

router.put('/cardscan', (req, res) => {
    console.log('/cardScan');
    cardAuthenticated = true;
    tryTransaction();
    res.send();
});

router.put('/fingerprint', (req, res) => {
    console.log('/fingerprint');
    fingerprintAuthenticated = true;
    tryTransaction();
    res.send();
});

router.put('/image', (req, res) => {
    console.log('/image');
    imageAuthenticated = true;
    tryTransaction();
    res.send();
});

app.use('/api', router);

app.use(function (req, res) {
    res.send(404);
});

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});

function tryTransaction() {
    if (!cardAuthenticated) return;
    if (!imageAuthenticated) return;
    if (!fingerprintAuthenticated) return;
    // Good to go
    if (!sellBitcoin) {
        console.log('Bitcoin sold')
        BTCBalance -= sellBitcoinValue;
        if (BTCBalance < 0) BTCBalance = 0;
        reset();
    }
    if (!buyETH) {
        console.log('ETH buy')
        ETHBalance += buyETHValue;
        if (ETHBalance < 0) ETHBalance = 0;
        reset();
    }
}

function reset() {
    console.log('transaction reset');
    cardAuthenticated = false;
    imageAuthenticated = false;
    fingerprintAuthenticated = false;
    sellBitcoinValue = 0;
    sellBitcoin = false;
    buyETH = false;
    buyETHValue = 0;
}
