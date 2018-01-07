var PORT = process.env.PORT || 8080;        // set our port

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

let BTCBalance = 1;

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

var buyBitcoin = false;
var buyBitcoinValue = 0;

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
    buyBitcoinValue = req.body.amount;
    console.log('BTC:', buyBitcoinValue);
    buyBitcoin = true;
    res.send();
});

router.put('/cardscan', (req, res) => {
    console.log('/cardScan');
    cardAuthenticated = true;
    trySellBTC();
    res.send();
});

router.put('/fingerprint', (req, res) => {
    console.log('/fingerprint');
    fingerprintAuthenticated = true;
    trySellBTC();
    res.send();
});

router.put('/image', (req, res) => {
    console.log('/image');
    imageAuthenticated = true;
    trySellBTC();
    res.send();
});

app.use('/api', router);

app.use(function (req, res) {
    res.send(404);
});

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});

function trySellBTC() {
    if (!buyBitcoin) return;
    if (!cardAuthenticated) return;
    if (!imageAuthenticated) return;
    if (!fingerprintAuthenticated) return;
    // Good to go
    console.log('Bitcoin sold')
    BTCBalance -= buyBitcoinValue;
    if(BTCBalance < 0) BTCBalance = 0;
    reset();
}

function reset() {
    console.log('transaction reset');
    cardAuthenticated = false;
    imageAuthenticated = false;
    fingerprintAuthenticated = false;
    buyBitcoinValue = 0;
    buyBitcoin = false;
}