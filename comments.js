//create web server
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var mysql = require('mysql');
//connect to mysql database
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'comments'
});

//connect to mysql database
connection.connect(function(err) {
	if(err) {
		console.log('Error connecting to Db');
		return;
	}
	console.log('Connection established');
});

//create table in mysql database
connection.query('CREATE TABLE IF NOT EXISTS comments(id int NOT NULL AUTO_INCREMENT, name VARCHAR(255), comment VARCHAR(255), PRIMARY KEY(id))', function(err) {
	if(err) throw err;
});

//create web server
app.use(express.static('public'));
app.get('/index.htm', function(req, res) {
	res.sendFile(__dirname + "/" + "index.htm");
})

//post comment
app.post('/process_post', urlencodedParser, function(req, res) {
	var response = {
		name: req.body.name,
		comment: req.body.comment
	};
	console.log(response);
	//insert comment into mysql database
	connection.query('INSERT INTO comments SET ?', response, function(err, result) {
		if(err) throw err;
		console.log(result);
	});
	res.end(JSON.stringify(response));
})

//read comments from mysql database
app.get('/comments', function(req, res) {
	connection.query('SELECT * FROM comments', function(err, rows, fields) {
		if(err) throw err;
		console.log('The solution is: ', rows);
		res.end(JSON.stringify(rows));
	});
})

//delete comment from mysql database
app.post('/delete_comment', urlencodedParser, function(req, res) {
	var response = {
		id: req.body.id
	};
	console.log(response);
	//delete comment from mysql database
	connection.query('DELETE FROM comments WHERE id = ?', response, function(err, result) {
		if(err) throw err;
		console.log(result);
	});
	res.end(JSON.stringify(response));
})

//update comment from mysql database
app.post('/update_comment', urlencodedParser, function(req, res) {
	var response = {
		id: req.body.id,
		comment: req.body.comment
	};
	console.log(response);
	//update comment from mysql database
	connection.query