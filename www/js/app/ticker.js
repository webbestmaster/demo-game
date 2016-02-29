define(['./../lib/rAF'], function (rAF) {

	var ticker = {

		updateIsActive: false,

		fps: 0,
		period: 16.66666666,

		setFPS: function (fps) {

			if (fps) {
				this.fps = fps;
				this.period = 1000 / fps;
			} else {
				this.fps = 0;
				this.period = 0;
			}

		},

		fn: [],

		add: function (fn) {

			this.fn.push(fn);

		},

		updateInterval: function () {

			for (var i = 0, len = this.fn.length; i < len; i += 1) {
				this.fn[i]();
			}

		},

		update: function () {

			if (this.updateIsActive) {

				rAF(this.update);

				for (var i = 0, len = this.fn.length; i < len; i += 1) {
					this.fn[i]();
				}

			}

		},

		start: function () {

			if (this.fps) {
				this.intervalId = setInterval(this.updateInterval, this.period);
			} else {
				this.updateIsActive = true;
				this.update();
			}

		},

		stop: function () {

			if (this.fps) {
				clearInterval(this.intervalId);
			} else {
				this.updateIsActive = false;
			}

		}

	};

	ticker.update = ticker.update.bind(ticker);
	ticker.updateInterval = ticker.updateInterval.bind(ticker);

	return ticker;

});