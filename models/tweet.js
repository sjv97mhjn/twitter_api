var mongoose = require('mongoose');
var tweetschema = new mongoose.Schema({

  text:String,
  screen_name:String,
  name:String,
  id:Number,
  retweet_count:Number,
  favorite_count:Number,
  created_at:Date,
  language:String,
  followers_count:Number,
  user_mentions:[],
  urls:[{
    url:String,
  }]
});
var tweet = mongoose.model('Tweet',tweetschema);
module.exports = tweet;
