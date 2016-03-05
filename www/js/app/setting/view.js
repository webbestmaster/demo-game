define(
	[
		'./../../lib/jbone',
		'./../../services/mediator',
		'./easing',
		'./../../lib/dot'
	],
	function ($, mediator, easing, dot) {

		var settingView = {

			$el: null,

			init: function () {

				this.define$el();

				this.bindEventListeners();

				this.show();

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
					var args = null;
					var period = this.getAttribute('data-period');
					var $timingFunctionFirstArg = $('.js-timing-function-first-arg[data-period="' + period + '"]');
					var $timingFunctionSecondArg = $('.js-timing-function-second-arg[data-period="' + period + '"]');

					switch (type) {

						case 'number':
							value = parseFloat(value);
							break;

					}

					if (key === 'timingFunction') {
						var fnData = easing[value];

						$timingFunctionFirstArg.css('display', 'none');
						$timingFunctionSecondArg.css('display', 'none');

						if (fnData.args !== null) {

							if (fnData.args === 1) {
								$timingFunctionFirstArg.css('display', 'block');
								args = [
									parseFloat($timingFunctionFirstArg.val())
								];
							}

							if (fnData.args === 2) {
								$timingFunctionFirstArg.css('display', 'block');
								$timingFunctionSecondArg.css('display', 'block');
								args = [
									parseFloat($timingFunctionFirstArg.val()),
									parseFloat($timingFunctionSecondArg.val())
								];
							}

						}

						mediator.publish('setting:timingFunction', {
							value: value,
							period: period,
							args: args
						});

						return;

					}

					mediator.publish('setting:' + keyType, {
						value: value,
						period: period,
						key: key
					});

				});

			},

			define$el: function () {

				var view = this;

				var tmplText = $('.js-template[data-name="setting-view"]').html();

				var innerHTML = dot.compile(tmplText)({
					easing: easing
				});

				view.$el = $(innerHTML);

			},

			hide: function () {
				this.$el.remove();
			},

			show: function () {
				document.body.appendChild(this.$el[0]);
			}

		};

		return settingView;

	}
);