(function($, Backbone, _, Mustache) {

  var Stulio = Stulio || {};

  Stulio = {
    Models: {},
    Collections: {},
    Views: {},
    Templates: {}
  }

  Stulio.config = {
    api_url: '/api/v2.0/',
  }

  Stulio.Models.Tweet = Backbone.Model.extend({
    parse: function(response) {
      return response.tweet;
    }
  });

  Stulio.Collections.Tweets = Backbone.Collection.extend({
    model: Stulio.Models.Tweet,
    parse: function(response) {
      return response.tweets;
    },
    url: function() {
      return Stulio.config.api_url + 'tweets.json?timeline=popular&page=1';
    },
    initialize: function() {
      console.log(['initialize:tweets', this]);
    }
  });

  Stulio.Router = Backbone.Router.extend({
    routes: {
      "": "index",
    },

    index: function() {
      console.log(['route:index']); 
      this.tweets = new Stulio.Collections.Tweets();
      this.tweets.fetch();
      console.log(['tweets', this.tweets]);
    }
  });

  $(function(){
    var app = new Stulio.Router();
    try {
      Backbone.history.start();
    } catch (err) {}
  });

})(jQuery, Backbone, _, Mustache);
