const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let accounts = []; // global store of accounts
let cart = [];

// Get all accounts
app.get('/accounts', (req, res) => {
    res.json(accounts);
});

// Add account
app.post('/add-account', (req, res) => {
    const { username, description, giggymux } = req.body;
    if (!username || !description || !giggymux) {
        return res.status(400).json({ error: "Missing fields" });
    }
    accounts.push({ username, description, giggymux, sold: false });
    res.json({ message: "Account added!" });
});

// Add to cart
app.post('/cart', (req, res) => {
    const { username } = req.body;
    const account = accounts.find(acc => acc.username === username && !acc.sold);
    if (!account) return res.status(404).json({ error: "Account not available" });

    cart.push(account);
    res.json({ message: "Added to cart!", cart });
});

// Buy from cart
app.post('/buy', (req, res) => {
    cart.forEach(item => {
        const acc = accounts.find(acc => acc.username === item.username);
        if (acc) acc.sold = true;
    });
    cart = [];
    res.json({ message: "Purchase successful!" });
});

// Get cart
app.get('/cart', (req, res) => {
    res.json(cart);
});

app.listen(3000, () => console.log("✅ Backend running at http://localhost:3000"));
