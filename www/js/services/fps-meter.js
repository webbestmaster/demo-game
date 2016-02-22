define (['./../lib/endless-array'], function (EndlessArray) {

	var fpsMeter = {

		node: null,
		counter: 0,
		log: new EndlessArray(10),
		cssClassName: 'fps-meter',
		defaultTextContent: '~\n~\n~',
		ticker: null,
		FPS: 0,
		averageFPS: 0,
		normalFPS: 60,

		init: function (ticker) {

			var fpsMeter = this;

			fpsMeter.ticker = ticker;

			ticker.add(fpsMeter.tick);

		},

		addNode: function () {

			var fpsMeter = this;

			var fpsNode = document.createElement('div');

			fpsNode.textContent = fpsMeter.defaultTextContent;
			fpsNode.className = fpsMeter.cssClassName;

			document.body.appendChild(fpsNode);

			fpsMeter.node = fpsNode;

		},

		tick: function () {

			var fpsMeter = this;

			fpsMeter.counter += 1;

			if (fpsMeter.counter < 5) {
				return;
			}

			fpsMeter.counter = 0;

			var log = fpsMeter.log;

			var tickerFPS = fpsMeter.ticker.FPS;
			fpsMeter.FPS = tickerFPS;

			log.push(tickerFPS);

			var averageFPS = log.average() || 0;
			fpsMeter.averageFPS = averageFPS;

			var scaleFPS = Math.min(averageFPS / fpsMeter.normalFPS, 1);
			fpsMeter.scaleFPS = scaleFPS;

			if (fpsMeter.node) {
				fpsMeter.node.textContent = tickerFPS.toFixed(1) + '\n' + averageFPS.toFixed(1) + '\n' + scaleFPS.toFixed(2);
			}

		}

	};

	fpsMeter.tick = fpsMeter.tick.bind(fpsMeter);

	return fpsMeter;

});