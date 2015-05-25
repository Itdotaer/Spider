var express = require('express');
var router = express.Router();
var spider = require('../core/spider');
var Post = require('../models/post');

//For sina
router.get('/sina', function(req, res, next) {
	spider.sinaSpider();
});

router.get('/netEasy', function(req, res, next){
	spider.netEasySpider();
});

router.get('/', function(req, res, next){
	Post.get(function(err, list){
		if(err){
			res.json({status: 'error', body: err});
		}

		res.json({status: 'success', body: list});
	});
});

module.exports = router;
