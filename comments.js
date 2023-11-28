//create web server
var express = require('express');
var app = express();
var server = require('http').createServer(app);

//setup socket.io
var io = require('socket.io').listen(server);

//setup mysql
var mysql = require("mysql");
var pool = mysql.createPool({
    connectionLimit: 10,
    host: "classmysql.engr.oregonstate.edu",
    user: "cs290_koehlert",
    password: "3306",
    database: "cs290_koehlert"
});

//setup handlebars
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//setup body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//setup path
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

//setup session
var session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//setup bcrypt
var bcrypt = require('bcrypt');

//setup nodemailer
var nodemailer = require('nodemailer');

//setup multer
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

//setup fs
var fs = require('fs');

//setup moment
var moment = require('moment');

//setup csrf
var csrf = require('csurf');
var csrfProtection = csrf({cookie: true});

//setup https
var https = require('https');
var key = fs.readFileSync('sslcert/key.pem');
var cert = fs.readFileSync('sslcert/cert.pem');
var options = {
    key: key,
    cert: cert
};

//setup port
var port = 3306;

//setup email transporter
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '