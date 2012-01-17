$(function(){
	var checkList = 'list'; // TODO: manage multiple lists

	var Item = Backbone.Model.extend({
		initialize: function() {
			
		}
	});
	
	var CheckList = Backbone.Collection.extend({
		model: Item,
		localStorage: new Store('lsc-'+checkList),
		nextOrder: function() {
			if (!this.length) return 1;
			return this.last().get('order') + 1;
		},
		comparator: function(item) {
			return item.get('order');
		}
	});
	var Items = new CheckList;
	
	var ItemView = Backbone.View.extend({
		template: _.template($('#item-template').html()),
		events: {
			
		},
		initialize: function() {
			_.bindAll(this, 'render');
		},
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		}
	});
	
	var AppView = Backbone.View.extend({
		el: $('#app'),
		events: {
			'click .add-task':  'createTask',
		},
		initialize: function() {
			_.bindAll(this, 'addOne', 'addAll', 'render');
			
			Items.bind('add', this.addOne);
			Items.bind('reset', this.addAll);
			Items.bind('all', this.render);
			Items.fetch();
		},
		render: function() {
			// TODO: add progress bar, stats, etc
		},
		addOne: function(item) {
			var view = new ItemView({model: item});
			this.$('#check-list').append(view.render().el);
		},
		addAll: function() {
			Items.each(this.addOne);
		},
		newAttributes: function() {		
			return {
				task: this.$('input[name="task"]').val(),
				group: this.$('input[name="group"]').val(),
				order: Items.nextOrder(),
				done: false
			};
		},
		createTask: function(e) {
			if (this.$('input[name="task"]').val() === "") return false;
			Items.create(this.newAttributes());
			this.$('input[name="task"]').val('')
		}
	});
	
	var App = new AppView;
});