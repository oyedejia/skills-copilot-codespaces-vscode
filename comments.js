//create web server
//create a web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comments = require('./models/comments');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var User = require('./models/user');

app.use(cors());

//connect to mongoose
mongoose.connect('mongodb://localhost:27017/comments');
var db = mongoose.connection;

//create a server
app.listen(3000);

//get the data from the server
app.use(bodyParser.json());

//get the data from the server
app.get('/api/comments', function(req, res){
	Comments.getComments(function(err, comments){
		if(err){
			throw err;
		}
		res.json(comments);
	})
});

//add a comment
app.post('/api/comments', function(req, res){
	var comment = req.body;
	Comments.addComment(comment, function(err, comment){
		if(err){
			throw err;
		}
		res.json(comment);
	})
});

//delete a comment
app.delete('/api/comments/:_id', function(req, res){
	var id = req.params._id;
	Comments.removeComment(id, function(err, comment){
		if(err){
			throw err;
		}
		res.json(comment);
	})
});

//update a comment
app.put('/api/comments/:_id', function(req, res){
	var id = req.params._id;
	var comment = req.body;
	Comments.updateComment(id, comment, {}, function(err, comment){
		if(err){
			throw err;
		}
		res.json(comment);
	})
});

//user registration
app.post('/api/user', function(req, res){
	var user = req.body;
	User.addUser(user, function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	})
});

//user login
app.post('/api/login', function(req, res){
	var user = req.body;
	User.getUser(user, function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	})
});