const express = require('express');
var path = require('path');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const router = require('./routes/routes');
const app      = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.resolve(__dirname, "views/pages"));
app.use(express.static('public'));

app.get(
    '/',(req, res) => {
        res.render('index')
    });

app.get(
    '/createuser',(req, res) => {
        res.render('createuser')
});

app.get(
    '/updateuser',(req, res) => {
        res.render('updateuser')
    });

app.get(
    '/deleteuser',(req, res) => {
        res.render('deleteuser')
    });

app.get(
    '/latency', (req, res) => {
        res.render('latency')
    });


app.use('/', router);

//Database
mongoose.connect('mongodb+srv://simencloud:elskerntnu@cluster0.5o3zb.mongodb.net/bank?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const db = mongoose.connection;

db.on('error', () => {'Error connecting to the database'});
db.on('open', () => {console.log("We have connection to database")});
app.listen(port, () => console.log(`Express server listening on port ${port}`));