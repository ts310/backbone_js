(function($, Backbone, _) {

  var Stulio = Twitter || {};

  Stulio = {
    Models: {},
    Collections: {},
    Views: {},
    Templates: {}
  }

  Stulio.Models.Tweet = Backbone.Model.extend({
  });

  Stulio.Models.Tweets = Backbone.Collection.extend({
    model: Stulio.Model.Tweet,
    url: function() {
      return '/tweets.json?timeline=popular&page=1'
    },
    initialize: function() {
      console.log(['initialize:tweets', this]);
    }
  });

  var Stulio.Router = Backbone.Router.extend({
    routes: {
      "": "index",
    },

      index: function() {
        console.log(['route:index']); 
        this.tweets = new Stulio.Collection.Tweets();
      }
  });

  $(function(){
    var app = Stulio.Router();
    try {
      Backbone.history.start();
    } catch (err) {}
  });

})(jQuery, Backbone, _);
