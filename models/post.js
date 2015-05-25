var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Post = module.exports;

var PostSchema = new Schema({
	title: { type: String, require: true },
	content: { type: String, require: true },
	publishedTime: { type: String },
	mediaSource: { type: String },
	createdDate: { type: Date, default: new Date() },
	sourceUrl: { type: String, require: true },
	spider: { type: String, require: true }
});

mongoose.model('Posts', PostSchema);

var PostModel = mongoose.model('Posts');

Post.get = function(callback){
	PostModel.find().exec(callback);
}

Post.getById = function(id, callback){
	PostModel.findOne({_id: id}).exec(callback);
};

Post.check = function(title, callback){
	PostModel.findOne({title: title}).exec(callback);
};

Post.add = function(post, callback){
	new PostModel(post).save(callback);
}