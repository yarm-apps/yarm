const express = require('express')
const app = express()

const ip = "localhost"
const port = 8000

app.use(express.static('public'));
app.use("/dist", express.static('dist'));
// app.use("/libs", express.static('node_modules'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})