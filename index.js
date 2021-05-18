const express = require('express');
const app = express();
const port = 4000;
const jwt = require('jsonwebtoken');
const secret = 'ThIsIsAsEcRet';

app.use(express.json());

// Create token and send back to client
app.post('/sign-token', (req, res) => {
    const payload = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        id: req.body.id
    };
    const expiry = 72000;

    if (!req.body.firstName || !req.body.lastName || !req.body.id) {
        return res.status(401).json({ message: 'A valid first name, last name, and ID is required' });
    }
    
    jwt.sign(payload, secret, {expiresIn: expiry}, (err, token) => {
        if (err) {
            return res.status(500).json({ err });
        } else {
            return res.status(200).json({ token });
        }
    })
})


// Receive & decode token from client
app.get('/decode-token', (req, res) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ message: "Authentication token is required" });
    }

    const authHeader = req.headers.authorization;
    const splittedStr = authHeader.split(' ');
    const token = splittedStr[1];

    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
            return res.status(500).json({ err });
        } else {
            return res.status(200).json({ user: decodedToken });
        }
    })
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})