
$( document ).ready(function() {
  $.ajaxSetup({
    headers: { 'Accept': 'application/json' }
  });
});

Darkboard = Ember.Application.create();

Darkboard.Router.map(function() {
  // put your routes here
  this.resource('posts', function() {
    this.route('new');
    this.resource('post', { path: ':id' });
  });
});

Darkboard.PostsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('post');
  }
});

Darkboard.PostsNewController = Ember.ObjectController.extend({
  actions: {    
      // I am almost sure this is not the correct way to save a new record... 
      save: function() {
          var post = this.store.createRecord('post', {
             title: this.get('title'),
             author: this.get('author'),
             body: this.get('body')
           });
          post.save();
          this.set('title', '');
          this.set('author', '');
          this.set('body', '');
          this.get('target.router').transitionTo('posts.index');
        }
  }
}); 

Darkboard.PostRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('post', params.id);
  }
});

Darkboard.PostController = Ember.ObjectController.extend({
    isEditing: false,
    actions: {
        editPost: function() {
          this.set('isEditing', true);
        },

        doneEditing: function() {
          this.set('isEditing', false);
          var post = this.get('model');
          post.save();
        },
        
        removePost: function () {
            var post = this.get('model');
            post.deleteRecord();
            post.save();
        }
    }
});

var attr = DS.attr;
Darkboard.Post = DS.Model.extend({
  author: attr('string'),
  title: attr('string'),
  body: attr('string'),
  created_at: attr(),
  updated_at: attr()
});

Darkboard.ApplicationAdapter = DS.RESTAdapter.extend({
  // this form of setting request headers is broken when host is used.
  // headers are being manually set with jQuery on $( document ).ready
  // headers: function() {
  //   return {
  //     'Accept' : 'application/json'
  //   };
  // },
  host: 'http://54.172.201.104'
});


