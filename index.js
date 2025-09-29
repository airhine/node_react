const express = require('express');
const app = express()
const port = 5000
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://airhine:1q2w3e4r@nodereact.l5fw2ub.mongodb.net/?retryWrites=true&w=majority&appName=nodereact', {  
}).then(() => console.log('connected'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))