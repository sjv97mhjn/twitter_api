var express = require("express");
var app = express();
var mongoose = require("mongoose");
var mongo_tweet = require("./models/tweet");
var config = require("./config/env_local");
var routes = require("./routes/route");
//var particlesJS = require('particles.js');
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

mongoose.Promise = global.Promise;
mongoose.connection.openUri(config.MONGO_DB_URI);
app.use("/", routes);

app.listen(process.env.PORT || 5000, function(req, res) {
  console.log("Listening on port 80");
});
