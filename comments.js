//create web server
const express = require('express');
//create router
const router = express.Router();
//import comment model
const Comment = require('../models/comment');
//import user model
const User = require('../models/user');

//import passport
const passport = require('passport');

//import helper function
const {ensureAuthenticated} = require('../helpers/auth');

//create comment route
router.get('/comments', ensureAuthenticated, (req, res) => {
    Comment.find({user: req.user.id})
        .populate('user')
        .then(comments => {
            res.render('comments/index', {
                comments: comments
            });
        });
});

//add comment form
router.get('/comments/add', ensureAuthenticated, (req, res) => {
    res.render('comments/add');
});

//process add comment
router.post('/comments', ensureAuthenticated, (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({text: 'Please add a title'});
    }
    if (!req.body.details) {
        errors.push({text: 'Please add some details'});
    }
    if (errors.length > 0) {
        res.render('comments/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        };
        new Comment(newUser)
            .save()
            .then(comment => {
                req.flash('success_msg', 'Comment added');
                res.redirect('/comments');
            })
    }
});

//edit comment form
router.get('/comments/edit/:id', ensureAuthenticated, (req, res) => {
    Comment.findOne({
        _id: req.params.id
    })
        .then(comment => {
            if (comment.user != req.user.id) {
                req.flash('error_msg', 'Not authorized');
                res.redirect('/comments');
            } else {
                res.render('comments/edit', {
                    comment: comment
                });
            }
        });
});

//process edit comment
router.put('/comments/:id', ensureAuthenticated, (req, res) => {
    Comment.findOne({
        _id: req.params.id
    })
        .then(comment => {
            comment.title = req.body.title;
            comment.details = req.body.details;

            comment.save()
                .then(comment