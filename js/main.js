(function (global) {
	
	var Application = function (options) {
		var that = this,
			container = document.getElementById(options.id),
			model = {};
			
		this.eventBus = new Observable();
		this.options = options;
		
		container.addEventListener("click", function (ev) {
			var action = ev.target.dataset.action;
			if (action && options.actions[action]) {
				options.actions[action].apply(that, arguments);
			}
		}, false);
		
		container.addEventListener("change", function (ev) {
			var action = ev.target.dataset.action;
			if (action && options.changes[action]) {
				options.changes[action].apply(that, arguments);
			}
		}, false);
		
		
		this.elements = {};
		if (options.elements) {
			this.fetchElements(options.elements, container);
		}
		
		this.eventBus.bind("model-update", function (model) {
			that.render(model, container);
		});
		
		this.init(options, model, container);
	};
	
	Application.prototype.init = function (options, model, container) {
		this.populateModel(model, options);
	};
	
	Application.prototype.fetchElements = function (spec, container) {
		var name;
		for (name in spec) {
			this.elements[name] = container.querySelector(spec[name]);
		}
	};
	
	Application.prototype.populateModel = function (model, options) {
		var eventBus = this.eventBus;
		net.getJson(options.url, function (data) {
			model.games = data;
			eventBus.emit("model-update", model);
		});
	};
	
	Application.prototype.render = function (model, container) {
		var markup = model.games.map(function (game, idx) {
			var buf = [];
			buf.push("<li data-player='");
			buf.push(game.player);
			buf.push("' data-id='");
			buf.push(game.id);
			buf.push("' data-action='show-game' class='player ");
			buf.push(game.type);
			buf.push("'>");
			buf.push("<span data-action='show-game' class='rank'>");
			buf.push(idx+1);
			buf.push(".</span>");
			buf.push("<span data-action='show-game' class='player'>");
			buf.push(game.player);
			buf.push("</span>");
			buf.push("<label data-action='show-game' class='duration'>");
			buf.push(format.time(game.duration));
			buf.push(" (" + game.score + ")");
			buf.push("</label>");
			buf.push("</li>");
			return  buf.join("");
		});
		container.querySelector(".target").innerHTML = markup.join("");
	};
	
	global.Application = Application;
}(this));