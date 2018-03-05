var express = require("express");
var router = express.Router();

var routes = {
  views: {
    index: require("./views/index"),
    stream: require("./views/stream"),
    query: require("./views/query")
  }
};
router.get("/",routes.views.index.homepage)
router.get("/developer", routes.views.index.developer);
router.get("/stream",routes.views.stream.keyword)
router.get("/fetch", routes.views.stream.fetch);
router.get("/query", routes.views.query.Filter);
router.get("/filter/:page", routes.views.query.filter);
router.get("/filter", routes.views.query.filter);
router.get("/downloadcsv",routes.views.query.downloadcsv);

module.exports = router;
