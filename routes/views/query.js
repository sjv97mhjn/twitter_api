var mongo_tweet = require("../../models/tweet");
var start = new Date(2012, 7, 4);
var end = Date.now();
var retweet_count_greaterThan = -1;
var retweet_count_lessThan = Number.MAX_SAFE_INTEGER;
var favorite_count_greaterThan = -1;
var favorite_count_lessThan = Number.MAX_SAFE_INTEGER;
var tweet_text = new RegExp();
var tweet_screen_name = new RegExp();
var Sort ;
var Tweet_Screen_Name ={};
var Tweet_Text = {};
var Limit =5;
var Skip =0;
var page= 0;
module.exports = {
  Filter: function(req, res) {
    res.render("filter.ejs");
  },
  filter: function(req, res) {
    if(req.params.page)
     page = Number(req.params.page);
     if(page<0)
     page=0;
    console.log(req.query);

  if(req.query.text){
    Sort = `${req.query.sort}`;
    if (req.query.retweetMin) retweet_count_greaterThan = req.query.retweetMin;

    if (req.query.retweetMax) retweet_count_lessThan = req.query.retweetMax;

    if (req.query.favoriteMin)
      favorite_count_greaterThan = req.query.favoriteMin;

    if (req.query.favoriteMax) favorite_count_lessThan = req.query.favoriteMax;

    if (req.query.start) start = req.query.start;

    if (req.query.end) end = req.query.end;

    var Tweet_Text = {
      contain: new RegExp(req.query.text, "i"),
      start: new RegExp("^" + req.query.text, "i"),
      end: new RegExp(req.query.text + "$", "i"),
      exact: req.query.text
    };

    if (req.query.text && req.query.tweet_type)
      tweet_text = Tweet_Text[req.query.tweet_type];


    var Tweet_Screen_Name = {
      contain: new RegExp(req.query.screen_name, "i"),
      start: new RegExp("^" + req.query.screen_name, "i"),
      end: new RegExp(req.query.screen_name + "$", "i"),
      exact: req.query.screen_name
    };

    if (req.query.screen_name && req.query.screen_name_type)
      tweet_screen_name = Tweet_Screen_Name[req.query.screen_name_type];
  }


    console.log(tweet_text);
    console.log(tweet_screen_name);

    var query = {
      text: tweet_text,
      screen_name: tweet_screen_name,
      created_at: { $gte: start, $lte: end },
      retweet_count: {
        $gt: retweet_count_greaterThan,
        $lt: retweet_count_lessThan
      },
      favorite_count: {
        $gt: favorite_count_greaterThan,
        $lt: favorite_count_lessThan
      }
    };
    mongo_tweet
      .find(query)
      .sort(Sort)
      .limit(Limit)
      .skip(page*Limit)
      .exec(function(err, results) {
        if (err) console.log(err);
        else {
          ParsedResult = csvParser(results);
          //console.log(results);
          //res.send(ParsedResult);
          res.render("filteredTweets.ejs", { Data: ParsedResult ,data:results,page:page});
        }
      });
  },
  downloadcsv : function(req,res){

    var query = {
      text: tweet_text,
      screen_name: tweet_screen_name,
      created_at: { $gte: start, $lte: end },
      retweet_count: {
        $gt: retweet_count_greaterThan,
        $lt: retweet_count_lessThan
      },
      favorite_count: {
        $gt: favorite_count_greaterThan,
        $lt: favorite_count_lessThan
      }
    };
    mongo_tweet
      .find(query)
      .sort(Sort)
      .exec(function(err, results) {
        if (err) console.log(err);
        else {
          ParsedResult = csvParser(results);
          //console.log(results);
          //res.send(ParsedResult);
          res.render("csv.ejs", { Data: ParsedResult});
        }
      });

  }

};

function csvParser(Data) {
  //console.log(Data);

  var csvContent =
    "Id,Screen_Name,Name,followers_count,retweet_count,language,created_at\n";
  console.log(Data.length);
  Data.forEach(function(data, index) {
    //console.log('Data ',Data,'index ',index,'content ',csvContent);
    var dataString = `${data.id},${data.screen_name},${data.name},${
      data.followers_count
    },${data.retweet_count},${data.language},${data.created_at}`;
    csvContent += index + 1 < Data.length ? dataString + "\n" : dataString;
  });
  console.log(csvContent);
  return csvContent;
}
