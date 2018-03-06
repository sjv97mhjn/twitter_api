module.exports = {

  /**
   * homepage - Renders Homepage of the application
   *
   * @param  {type} req Request Object
   * @param  {type} res Response Object
   */
  homepage:function(req,res){
    res.render("main.ejs");
  },

  /**
   * developer - Renders Developer Page (My - Profile)
   * @param  {type} req Request Object
   * @param  {type} res Response Object
   */
  developer: function(req, res) {
    res.render("developer.ejs");
  }
};
