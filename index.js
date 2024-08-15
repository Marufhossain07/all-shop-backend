const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = 5000;

app.use(express.json())

app.get('/', (req, res) => {
    res.send('server is running very high')
})

app.listen(port, () => {
    console.log('the server is running man');
})