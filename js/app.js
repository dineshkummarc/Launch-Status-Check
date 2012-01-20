$(function(){
	var checkList = 'list-one'; // TODO: manage multiple lists
	
	var List = Backbone.Model.extend({
		initialize: function() {
		
		}
	});
	
	var CheckLists = Backbone.Collection.extend({
		model: List,
		localStorage: new Store('lsc-lists')
	});
	var Lists = new CheckLists;
	
	var Item = Backbone.Model.extend({
		initialize: function() {
			
		}
	});
	
	var CheckListItems = Backbone.Collection.extend({
		model: Item,
		localStorage: new Store('lsc-list-items'),
		nextOrder: function() {
			if (!this.length) return 1;
			return this.last().get('order') + 1;
		},
		comparator: function(item) {
			return item.get('order');
		}
	});
	var Items = new CheckListItems;
	
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
		createTask: function(e) {
			if (this.$('input[name="task"]').val() === "") return false;
			Items.create({
				task: this.$('input[name="task"]').val(),
				group: this.$('input[name="group"]').val(),
				order: Items.nextOrder(),
				done: false
			});
			this.$('input[name="task"]').val('');
			this.$('input[name="group"]').val('');
		}
	});
	
	var App = new AppView;
});