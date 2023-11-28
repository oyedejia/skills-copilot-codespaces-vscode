//create web server
const express = require('express');
const router = express.Router();
//import the comments model
const Comments = require('../models/comments');
//import the user model
const User = require('../models/user');
//import the passport module
const passport = require('passport');
//import the multer module
const multer = require('multer');
//import the path module
const path = require('path');

//configure storage setting
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/comment');
    },
    filename: function (req, file, cb) {
        //set the file name
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

//configure upload setting
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //file size limit to 5MB
    },
    fileFilter: function (req, file, cb) {
        //check the file type
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            cb(null, true); //accept the file
        } else {
            cb(null, false); //reject the file
        }
    }
});

//configure the route to get the comments page
router.get('/', (req, res) => {
    //check the user login status
    if (req.isAuthenticated()) {
        //find all comments
        Comments.find((err, data) => {
            if (err) throw err;
            //find the user information
            User.findOne({
                username: req.user.username
            }, (err, user) => {
                if (err) throw err;
                //render the comments page
                res.render('comments', {
                    title: 'Comments',
                    user: user,
                    comments: data
                });
            });
        });
    } else {
        //redirect to the login page
        res.redirect('/login');
    }
});

//configure the route to get the add comment page
router.get('/add', (req, res) => {
    //check the user login status
    if (req.isAuthenticated()) {
        //find the user information
        User.findOne({
            username: req.user.username
        }, (err, user) => {
            if (err) throw err;
            //render the add comment