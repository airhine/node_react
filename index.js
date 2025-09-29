const express = require('express');
const app = express()
const port = 5000
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const config = require('./config/key');
const {User} = require('./models/User');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


mongoose.connect(config.mongoURI, {  
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! test'))

app.post('/register', (req, res) =>{
    const user = new User(req.body)
     user.save()
        .then((userInfo) => res.status(200).json({ success: true }))
        .catch((err) => res.json({ success: false, err }));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))