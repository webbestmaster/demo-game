define (['./../lib/pixi', './../lib/util', './../lib/deferred', './../services/log', './wheels-data', './wheel', './texture-master',
		'./frame-master', './effect-master', './../services/fps-meter'],
	function (PIXI, util, Deferred, log, wheelsData, Wheel, textureMaster, frameMaster, effectMaster, fpsMeter) {

	var game = {

		wheels: [],

		original: {
			full: {
				w: 780,
				h: 520
			}
		},

		i: true,

		state: 'ready',

		initialize: function (cd) {

			var game = this;

			game.initCanvas();

			game.redraw = game.redraw.bind(game);

			textureMaster.initTextures().done(function () {
				frameMaster.initSprites();
				effectMaster.initSprites();
				game.createWheels();
				game.bindEventListeners();
				game.initTicker(game.redraw); // START GAME!!!
				cd();
			});

			game.spinButton = document.querySelector('.js-spin');

		},

		initTicker: function (fn) {

			var game = this;

			//var ticker = new PIXI.ticker.Ticker();
			var ticker = PIXI.ticker.shared;

			ticker.add(fn);

			fpsMeter.init(ticker);

			//todo: detect dev mode to avoid it
			fpsMeter.addNode();

			ticker.start();

			game.ticker = ticker;

		},

		bindEventListeners: function () {

			var game = this;

			game.spinButton.addEventListener('click', function () {

				game.spin();

			}, false);

		},

		spin: function () {

			// do not spin if no data about FPS
			if (!fpsMeter.scaleFPS) {
				return;
			}

			var game = this;

			switch (game.state) {

				case 'ready':

					effectMaster.hideClips();

					game.setGameState('spin-begin');

					game.beginSpin();

					break;

				case 'spin':

					game.setGameState('spin-end');

					game.endSpin();

					break;

			}

		},

		setGameState: function (state) {

			console.log('game state is - ', state);

			this.state = state;

			if (state === 'ready' || state === 'spin') {
				this.spinButton.className = 'spin-btn';
			} else {
				this.spinButton.className = 'spin-btn spin-btn_disabled';
			}

		},

		beginSpin: function () {

			var game = this;

			var wheels = game.wheels;

			var extraWheelData = {
				scaleFPS: fpsMeter.scaleFPS
			};

			wheels.forEach(function (wheel, index) {
				setTimeout(function () {
					wheel.beginSpin(extraWheelData);
				}, 300 * index);
			});

			wheels[wheels.length - 1].beginSpinCb = function () {
				game.setGameState('spin');
			};

		},

		endSpin: function () {

			var game = this;

			var wheels = game.wheels;

			var getEndPositions = game.getEndPositions();

			wheels.forEach(function (wheel, index, arr) {

				// start from index = 1
				if (index) {
					arr[index - 1].endSpinCb = wheel.endSpin.bind(wheel, getEndPositions[index]);
					return;
				}

				// stop first wheel
				wheel.endSpin(getEndPositions[index]);

			});


			wheels[wheels.length - 1].endSpinCb = function () {

				game.setGameState('ready');

				effectMaster.showWinClubs(getEndPositions);

				effectMaster.showFreeSpinPopUp();

				game.setWheelBg('bonus');

			};

		},

		getEndPositions: function () {

			var firstPosition = Math.floor(Math.random() * 3);

			var minPosition;

			var positions = [
				firstPosition,
				firstPosition += Math.floor(Math.random() * 3) - 1,
				firstPosition += Math.floor(Math.random() * 3) - 1,
				firstPosition += Math.floor(Math.random() * 3) - 1,
				firstPosition += Math.floor(Math.random() * 3) - 1,
				firstPosition
			];

			minPosition = Math.min.apply(Math, positions);

			if (minPosition < 0) {
				positions = positions.map(function (position) {
					return position - minPosition;
				});
			}

			return positions;

		},

		initCanvas: function () {

			var game = this,
				q = 1,
				width = game.original.full.w * q,
				height = game.original.full.h * q,
				renderer,
				stageMain, stageWheels, stageFrame, stageEffect;

			// init renderer
			renderer = new PIXI.autoDetectRenderer(width, height, {
				transparent: true,
				view: document.querySelector('.game-renderer'),
				resolution: 1 // set 2 or 3 to use higher resolution
				//,clearBeforeRender: false // right now canvas is cleared every tick,
				//,preserveDrawingBuffer: true // uncomment this (clearBeforeRender, preserveDrawingBuffer) if clearing is needless
			});
			game.renderer = renderer;

			// init main stage
			stageMain = new PIXI.Container();
			stageMain.scale.x = q;
			stageMain.scale.y = q;

			// init child stages
			stageWheels = new PIXI.Container();

			stageFrame = new PIXI.ParticleContainer(18, {
				scale: false,
				position: false,
				rotation: false,
				uvs: false,
				alpha: false
			});

			stageEffect = new PIXI.Container();

			stageMain.addChild(stageWheels);
			stageMain.addChild(stageFrame);
			stageMain.addChild(stageEffect);

			// link stage with frameMaster and effectMaster
			frameMaster.stage = stageFrame;
			effectMaster.stage = stageEffect;

			game.stageMain = stageMain;
			game.stageWheels = stageWheels;
			game.stageFrame = stageFrame;
			game.stageEffect = stageEffect;

		},

		createWheels: function () {

			var game = this;

			var wheels = game.wheels;

			wheelsData.wheels.forEach(function (wheelData) {

				var wheelStage = new PIXI.Container();

				game.stageWheels.addChild(wheelStage);

				// add mask
				var graphics = new PIXI.Graphics();
				graphics.beginFill(0, 0);
				wheelStage.mask = graphics.drawRect(wheelData.x, wheelData.y, wheelsData.item.w, wheelData.hi * wheelsData.item.h);

				wheelStage.position.x = wheelData.x;
				wheelStage.position.y = wheelData.y;

				var newWheel = new Wheel({
					hi: wheelData.hi,
					itemHeight: wheelsData.item.h,
					position: 0,
					stage: wheelStage
				});

				wheels.push(newWheel);

				newWheel.updatePosition();

			});

		},

		setWheelBg: function (type) {

			var wheels = this.wheels,
				i, len;

			for (i = 0, len = wheels.length; i < len; i += 1) {
				wheels[i].setBg(type);
			}

		},

		redraw: function () {

			effectMaster.update();
			//frameMaster.update();

			var wheels = this.wheels,
				i, len;

			for (i = 0, len = wheels.length; i < len; i += 1) {
				wheels[i].updatePosition();
			}

			/*
			 // do not each frame, draw odd frame only
			 if (this.i = !this.i) { // here use single "=" for small optimization
			 return;
			 }
			 */

			this.renderer.render(this.stageMain);

		}

	};

	return game;
});