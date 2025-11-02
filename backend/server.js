require('dotenv').config();
const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.send("Working!")
})

const PORT = 3001 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})