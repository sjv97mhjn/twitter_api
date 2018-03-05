module.exports = {
  homepage:function(req,res){
    res.render("main.ejs");
  },
  developer: function(req, res) {
    res.render("developer.ejs");
  }
};
