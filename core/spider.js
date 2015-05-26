var request = require('request');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var cheerio = require('cheerio');
var config = require('../web.config');
var Post = require('../models/post');

sinaSpiderForContent = function(url){
	var options = {
		url: url
	};
	var req = request(options);

	req.on('error', function(err){
		console.log('Error:', err);	
	});
	req.on('response', function(response){
		var bufferHelper = new BufferHelper();
		response.on('data', function(chunk){
			bufferHelper.concat(chunk);
		});

		response.on('end', function(){
			var rs = iconv.decode(bufferHelper.toBuffer(), 'GBK');

			//整理内容
			var $ = cheerio.load(rs);
			
			var $title = $('#artibodyTitle');
			var $time_source = $('.time-source');
			var $media_source = $('.time-source span');
			var $content = $('#artibody');

			var cbData = {
				title: $title.text().trim(),
				publishedTime: $time_source.text().trim().substring(0, $time_source.text().trim().search(' ')),
				mediaSource: $media_source.text().trim(),
				content: $content.text().trim(),
				sourceUrl: url,
				spider: 'sina'
			};

			if(cbData.publishedTime === ''){
				cbData.publishedTime = $('pub_date').text().trim();
			}
			if(cbData.mediaSource === ''){
				cbData.mediaSource = $('#author_ename a').text().trim();
			}
			
			//Save
			if(cbData.title === '' || cbData.content === ''){
				//Nothing
			}else{
				Post.check(cbData.title, function(err, post){
					if(err){ 
						console.log('Check post error');
					}

					if(!post){
						Post.add(cbData, function(err, post){
							if(err) console.log('Get content error:', err);

							console.log('Write to mongo successed. callback=', post);

							sinaSpiderForIndex(url);
						});
					}
				});
			}
		})
	});
};


sinaSpiderForIndex = function(url){
	var options = {
		url: url
	};
	var req = request(options);

	req.on('error', function(err){
		console.log('error:', err);
	});
	req.on('response', function(response){
		var bufferHelper = new BufferHelper();
		response.on('data', function(chunk){
			bufferHelper.concat(chunk);
		});

		response.on('end', function(){
			var rs = iconv.decode(bufferHelper.toBuffer(), 'GBK');

			//整理内容
			var $ = cheerio.load(rs);
			$('a').each(function(){
				var $me = $(this);

				var href= $me.attr('href') + '';
				
				if(href.search('http://news.sina.com.cn') > -1){
					sinaSpiderForContent(href);
				}
			});
		});
	});
};

netEasySpiderForContent = function(url){
	var options = {
		url: url
	};
	var req = request(options);

	req.on('error', function(err){
		console.log('Error:', err);	
	});
	req.on('response', function(response){
		var bufferHelper = new BufferHelper();
		response.on('data', function(chunk){
			bufferHelper.concat(chunk);
		});

		response.on('end', function(){
			var rs = iconv.decode(bufferHelper.toBuffer(), 'GBK');

			//整理内容
			var $ = cheerio.load(rs);
			
			var $title = $('#h1title');
			var $time_source = $('div.ep-time-soure');
			var $media_source = $('#ne_article_source');
			var $content = $('#endText');

			var cbData = {
				title: $title.text().trim() ? $title.text().trim() : '',
				publishedTime: $time_source.text().trim().substring(0, $time_source.text().trim().search('来')),
				mediaSource: $media_source.text().trim(),
				content: $content.text().trim(),
				sourceUrl: url,
				spider: '163'
			};

			if(cbData.publishedTime === ''){
				cbData.publishedTime = $('div.ep-info .left').text().trim().substring(0, $('div.ep-info .left').text().trim().search('来'));
			}

			if(cbData.mediaSource === ''){
				cbData.mediaSource = $('div.ep-info .left:first-child').text().trim();
			}
			
			if(cbData.title === '' || cbData.content === ''){
				//Nothing
			}else{
				Post.check(cbData.title, function(err, post){
					if(err){ 
						console.log('Check post error');
					}

					if(!post){
						Post.add(cbData, function(err, post){
							if(err) console.log('Get content error:', err);

							console.log('Write to mongo successed. callback=', post);

							netEasySpiderForIndex(url);
						});
					}
				});
			}
		})
	});
};


netEasySpiderForIndex = function(url){
	var options = {
		url: url
	};
	var req = request(options);

	req.on('error', function(err){
		console.log('error:', err);
	});
	req.on('response', function(response){
		var bufferHelper = new BufferHelper();
		response.on('data', function(chunk){
			bufferHelper.concat(chunk);
		});

		response.on('end', function(){
			var rs = iconv.decode(bufferHelper.toBuffer(), 'GBK');

			//整理内容
			var $ = cheerio.load(rs);
			$('a').each(function(){
				var $me = $(this);

				var href= $me.attr('href') + '';
				
				if(href.search('http://news.163.com') > -1){
					netEasySpiderForContent(href);
				}
			});
		});
	});
};

exports.sinaSpider = function(){
	sinaSpiderForIndex(config.SPIDER_ADDRESS.SINA);
}

exports.netEasySpider = function(){
	netEasySpiderForIndex(config.SPIDER_ADDRESS.NETEASY);
}

exports.spider = function(){
	console.log('=============Begin==============');
	sinaSpiderForIndex(config.SPIDER_ADDRESS.SINA);
	netEasySpiderForIndex(config.SPIDER_ADDRESS.NETEASY);
	console.log('=============End==============');
}