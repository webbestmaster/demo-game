define (['./../../lib/jbone', './../../services/mediator'], function ($, mediator) {

	var settingView = {

		$el: null,

		init: function () {

			this.define$el();

			this.bindEventListeners();

			// create DOM element
			// bind events on controls

		},

		bindEventListeners: function () {

			var $nodes = this.$el.find('[data-wheel-key], [data-game-key]');

			$nodes.on('change', function () {

				// here use .getAttribute('data-wheel-key') instead of dataSet
				// cause old android (4.1.2) do not support dataSet

				// get key type: wheel or game
				var keyType = this.attributes.hasOwnProperty('data-wheel-key') ? 'wheel' : 'game';
				var key = this.getAttribute('data-' + keyType + '-key');
				var type = this.getAttribute('type');
				var value = this.value;

				switch (type) {

					case 'number':
						value = parseFloat(value);
						break;

				}

				mediator.publish('setting:' + keyType, {
					key: key,
					value: value
				});

			});

		},

		define$el: function () {
			this.$el = $('.js-setting');
		},

		hide: function () {
			this.$el.remove();
		},

		show: function () {
			document.body.appendChild(this.$el[0]);
		}

	};

	return settingView;

});