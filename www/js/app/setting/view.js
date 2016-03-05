define(
	[
		'./../../lib/jbone',
		'./../../services/mediator',
		'./easing',
		'./../../lib/dot',
		'./../wheels-data'
	],
	function ($, mediator, easing, dot, wheelData) {

		var settingView = {

			$el: null,

			init: function () {

				this.define$el();

				this.bindEventListeners();

				this.setupSelects();

				this.show();

				// create DOM element
				// bind events on controls

			},

			setupSelects: function () {

				var view = this;

				view.$el.find('select').forEach(function (select) {

					var $select = $(select);
					var period = $select.attr('data-period');

					$select.val(wheelData.config[period].timingFunction.name);

					var args = wheelData.config[period].timingFunction.args;

					if (!args) {
						return;
					}

					if (args.length === 1 || args.length === 2) {
						view.$el
							.find('.js-timing-function-first-arg[data-period="' + period + '"]')
							.val(args[0])
							.removeClass('disabled');
					}

					if (args.length === 2) {
						view.$el
							.find('.js-timing-function-second-arg[data-period="' + period + '"]')
							.val(args[1])
							.removeClass('disabled');
					}

				});

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

						$timingFunctionFirstArg.addClass('disabled');
						$timingFunctionSecondArg.addClass('disabled');

						if (fnData.args !== null) {

							if (fnData.args === 1) {
								$timingFunctionFirstArg.removeClass('disabled');
								args = [
									parseFloat($timingFunctionFirstArg.val())
								];
							}

							if (fnData.args === 2) {
								$timingFunctionFirstArg.removeClass('disabled');
								$timingFunctionSecondArg.removeClass('disabled');
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
					easing: easing,
					wheelData: wheelData
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