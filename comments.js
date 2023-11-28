//create web server
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var db = mongojs('commentdb',['commentdb']);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = new Schema({
  title: String,
  body: String,
  date: Date
});
var Comment = mongoose.model('Comment', commentSchema);
var date = new Date();
var dateTime = date.toISOString();
var port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/commentdb');
mongoose.connection.once('open', function(){
  console.log('Connection has been made, now make fireworks...');
}).on('error', function(error){
  console.log('Connection error:', error);
});

app.post('/comment', function(req, res, next){
  var comment = new Comment({
    title: req.body.title,
    body: req.body.body,
    date: dateTime
  });
  comment.save(function(err, comment){
    if(err){
      return next(err);
    }
    res.json(201, comment);
  });
});

app.get('/comment', function(req, res, next){
  Comment.find(function(err, comments){
    if(err){
      return next(err);
    }
    res.json(comments);
  });
});

app.get('/comment/:id', function(req, res, next){
  Comment.findById(req.params.id, function(err, comment){
    if(err){
      return next(err);
    }
    res.json(comment);
  });
});

app.put('/comment/:id', function(req, res, next){
  Comment.findByIdAndUpdate(req.params.id, req.body, function(err, comment){
    if(err){
      return next(err);
    }
    res.json(comment);
  });
});

app.delete('/comment/:id', function(req, res, next){
  Comment.findByIdAndRemove(req.params.id, req.body, function(err, comment){
    if(err){
      return next(err);
    }
    res.json(comment);
  });
});

app.listen(port, function(){
  console.log('Server is running on port ' + port);
});