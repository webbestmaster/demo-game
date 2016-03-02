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

			var $nodes = this.$el.find('[data-key]');

			$nodes.on('change', function () {

				// here use .getAttribute('data-key') instead of dataSet
				// cause old android is not support dataSet
				var key = this.getAttribute('data-key');
				var type = this.getAttribute('type');
				var value = this.value;

				switch (type) {

					case 'number':
						value = parseFloat(value);
						break;

				}

				mediator.publish('setting:wheel', {
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