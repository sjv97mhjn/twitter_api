var mongo_tweet = require("../../models/tweet");
//Global Query Variables
var start = new Date(2012, 7, 4);
var end = Date.now();
var retweet_count_greaterThan = -1;
var retweet_count_lessThan = Number.MAX_SAFE_INTEGER;
var favorite_count_greaterThan = -1;
var favorite_count_lessThan = Number.MAX_SAFE_INTEGER;
var tweet_text = new RegExp();
var tweet_screen_name = new RegExp();
var Sort;
var Tweet_Screen_Name = {};
var Tweet_Text = {};
var Limit = 5;
var Skip = 0;
var page = 0;
var language = 'en';

module.exports = {
  /**
   * Filter - Renders The Query Filter Page
   * @param  {type} req Request Object
   * @param  {type} res Response Object \
   */
  Filter: function(req, res) {
    res.render("filter.ejs");
  },

  /**
   * filter - Apply Mongo based query depending upon the query passed by users
   *          Initial query parameters set to default first
   *          If the query is not passed then uses the past value of query variables
   * @param  {type} req Request Object
   * @param  {type} res Response Object    */
  filter: function(req, res) {
    if (req.params.page) page = Number(req.params.page);
    if (page < 0) page = 0;

    if (req.query.check) {        //Checks if Request Query Object is obtained by checking hidden check Attribute of Filter form
      initialize();                //If query Object is obtained , First all query variables are set to default values
      getQuery(req.query);         // Then query object is modified with respect to request query object obtained
    }

    console.log(tweet_text);
    console.log(tweet_screen_name);

    var query = {
      text: tweet_text,
      language : language,
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
    console.log(query);
    mongo_tweet
      .find(query)
      .sort(Sort)
      .limit(Limit)
      .skip(page * Limit)
      .exec(function(err, results) {
        if (err) console.log(err);
        else {
          ParsedResult = csvParser(results);
          //console.log(results);
          //res.send(ParsedResult);
          res.render("filteredTweets.ejs", {
            Data: ParsedResult,
            data: results,
            page: page
          });
        }
      });
  },
  downloadcsv: function(req, res) {
    var query = {
      language : language,
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
    console.log("Final Query ",query);
    mongo_tweet
      .find(query)
      .sort(Sort)
      .exec(function(err, results) {
        if (err) console.log(err);
        else {
          ParsedResult = csvParser(results);
          //console.log(results);
          //res.send(ParsedResult);
          res.render("csv.ejs", { Data: ParsedResult });
        }
      });
  }
};

//Helper Functions :-

/**
 * var initialize - Initialize the global variables to default before executing the query
 */
var initialize = function() {
  mongo_tweet = require("../../models/tweet");
  start = new Date(2012, 7, 4);
  end = Date.now();
  retweet_count_greaterThan = -1;
  retweet_count_lessThan = Number.MAX_SAFE_INTEGER;
  favorite_count_greaterThan = -1;
  favorite_count_lessThan = Number.MAX_SAFE_INTEGER;
  tweet_text = new RegExp();
  tweet_screen_name = new RegExp();
  Sort;
  Tweet_Screen_Name = {};
  Tweet_Text = {};
  Limit = 5;
  Skip = 0;
  page = 0;
  language= 'en';
};

/**
 * var getQuery - Initialize the global query variables as per request query obtained;
 * @param  {type} query Request query Object
 */
var getQuery = function(query) {
  console.log("Query Recieved");
  console.log(query);
  if(query.language) language=query.language;
  if (query.sort) Sort = `${query.sort}`;

  if (query.retweetMin) retweet_count_greaterThan = query.retweetMin;

  if (query.retweetMax) retweet_count_lessThan = query.retweetMax;

  if (query.favoriteMin) favorite_count_greaterThan = query.favoriteMin;

  if (query.favoriteMax) favorite_count_lessThan = query.favoriteMax;

  if (query.start) start = query.start;

  if (query.end) end = query.end;
  if (query.text) {
    var Tweet_Text = {
      contain: new RegExp(query.text, "i"),
      start: new RegExp("^" + query.text, "i"),
      end: new RegExp(query.text + "$", "i"),
      exact: query.text
    };
  }

  if (query.text && query.tweet_type) tweet_text = Tweet_Text[query.tweet_type];

  if (query.screen_name) {
    var Tweet_Screen_Name = {
      contain: new RegExp(query.screen_name, "i"),
      start: new RegExp("^" + query.screen_name, "i"),
      end: new RegExp(query.screen_name + "$", "i"),
      exact: query.screen_name
    };
  }

  if (query.screen_name && query.screen_name_type)
    tweet_screen_name = Tweet_Screen_Name[query.screen_name_type];
};

/**
 * csvParser - Parse the result obtained by the mongo into csv format string
 * @param  {type} req Request Object
 * @param  {type} res Response Object
 */
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
