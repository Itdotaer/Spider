var express = require('express');
var router = express.Router();
var Post = require('../models/post');

/* GET home page. */
router.get('/', function(req, res, next) {
  Post.get(function(err, list){
		res.render('index', {
			title: 'Spider posts',  
			posts: list, 
			error: err
		});
	});
});

router.get('/posts/:id', function(req, res, next){
	Post.getById(req.params.id, function(err, post){
		res.render('detail', {
			title: post.title,
			post: post,
			error: err
		});
	});
});

module.exports = router;
