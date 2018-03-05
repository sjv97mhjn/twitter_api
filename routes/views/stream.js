var Twitter = require("node-tweet-stream");
var config = require("../../config/env_local");
var mongo_tweet = require("../../models/tweet");
var t = new Twitter({
  consumer_key: config.TWITTER_CONSUMER_KEY,
  consumer_secret: config.TWITTER_CONSUMER_SECRET,
  token: config.TWITTER_ACCESS_TOKEN_KEY,
  token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
});

t.on("tweet", function(tweet) {
  var my_tweet = new mongo_tweet({
    text: tweet.text,
    created_at: tweet.created_at,
    screen_name: tweet.user.screen_name,
    name: tweet.user.name,
    id: tweet.user.id,
    followers_count: tweet.user.followers_count,
    retweet_count: tweet.retweet_count,
    favorite_count: tweet.favorite_count,
    user_mentions: tweet.entities.user_mentions,
    language: tweet.lang,
    urls: tweet.entities.urls
  });

  TweetArray.push(my_tweet);
  my_tweet.save(function(err, result) {
    if (err) console.log(err);
    else {
      //console.log(result);
    }
  });
});

t.on("error", function(err) {
  console.log("Oh no");
});

module.exports = {
  keyword:function(req,res){
    res.render("keyword.ejs");
  },
  fetch: function(req, res) {
    console.log(req.query.keyword);
    TweetArray = [];
    t.track(req.query.keyword);
    setTimeout(function() {
      t.untrack(req.query.keyword);
      //res.send(TweetArray);
      //console.log(TweetArray);
    }, 20000);
    res.redirect("/");
  }
};
