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
      this.totalPages = response.totalPages;
      this.page += 1;
      return response.tweets;
    },

    url: function() {
      var params = [];
      params.push('page=' + this.page);
      params.push('timeline=' + this.timeline);
      return Stulio.config.api_url + 'tweets.json?' + params.join('&');
    },

    initialize: function() {
      console.log('initialize');
      this.page = 1;
      this.totalPages = 1;
      this.timeline = 'popular';
    }
  });
  
  Stulio.Views.Tweets = Backbone.View.extend({
    el: '#tweets',

    events: {
      'click .load_more': 'loadMore',
      'click .reload': 'reload',
      // 'click .item': 'itemClicked'
    },

    initialize: function() {
      console.log('initialize');
      _.bindAll(this, 'render', 'add', 'remove', 'reset', 'loading', 'loadingFinished');
      this.collection.bind('reset', this.reset);
      this.collection.bind('add', this.add);
      this.elements = {};
    },

    render: function() {
      console.log('render');
      if (!this._rendered) {
        this.$el.empty().html(Mustache.to_html($('#template_tweet_grid').html(), {}));
        this.elements.loadingMore = this.$el.find('.load_more');
        this.elements.loading = this.$el.find('.loading');
        this.elements.loading.hide();
        this.elements.content = this.$el.find('.list_content');
        this._rendered = true;
        this.collection.fetch({
          beforeSend: this.loading,
          complete: this.loadingFinished
        });
      }
    },

    add: function(tweet) {
      console.log('add');
      var item = $(Mustache.to_html($('#template_tweet_grid_item').html(), 
          tweet.toJSON()));
      this.elements.content.append(item);
    },

    remove: function() {
      console.log('remove');
    },

    reset: function(models) {
      console.log('reset');
      this.elements.content.find('.item').remove();
      this.collection.each(this.add);
    },

    loadMore: function(event) {
      console.log('loadMore');
      event.preventDefault();
      var self = this;
      this.collection.fetch({
        add: true,
        beforeSend: this.loading,
        complete: this.loadingFinished
      });
    },

    reload: function() {
      console.log('reload');
      event.preventDefault();
      this.collection.totalPages = 1;
      this.collection.page = 1;
      this.collection.fetch({
        beforeSend: this.loading,
        complete: this.loadingFinished
      });
    },

    loading: function() {
      console.log('loading');
      this.elements.loading.show();
      this.elements.loadingMore.hide();
    },

    loadingFinished: function() {
      console.log('loadingFinished');
      this.elements.loading.hide();
      this.elements.loadingMore.show();
    },

    itemClicked: function(event) {
      event.preventDefault();
      var id = $(this).attr('data-item-id');
      app.navigate('tweets/' + id, {trigger:true});
    }
  });

  Stulio.Views.Tweet = Backbone.View.extend({
    className: 'tweet_detail',

    render: function() {
      this.$el.html(Mustache.to_html($('#template_tweet_detail').html(), this.model.toJSON()));
      return this;
    }
  });

  Stulio.Router = Backbone.Router.extend({
    routes: {
      ""           : "tweets",
      "tweets"     : "tweets",
      "tweets/:id" : "tweet",
    },

    tweets: function() {
      console.log('tweets'); 
      this.tweets = new Stulio.Collections.Tweets();
      this.tweetsView = new Stulio.Views.Tweets({
        collection: this.tweets
      });
      this.tweetsView.render();
    },

    tweet: function(id) {
      console.log(['tweet', id]);
      if (id) {
        var tweet = this.tweets.get(id);
        console.log(tweet.toJSON());
        var detailView = new Stulio.Views.Tweet({
          model: tweet
        });
        detailView.render();
        $('body').append(detailView.el);
      }
    }
  });

  $(function(){
    window.app = new Stulio.Router();
    try {
      Backbone.history.start();
    } catch (err) {}
  });

})(jQuery, Backbone, _, Mustache);
