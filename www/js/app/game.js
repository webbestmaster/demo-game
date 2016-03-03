define (
	[
		'./../lib/pixi',
		'./../lib/util',
		'./../lib/deferred',
		'./../services/log',
		'./wheels-data',
		'./wheel',
		'./texture-master',
		'./frame-master',
		'./effect-master',
		//'./ticker',
		'./../services/mediator'
	],

	function (PIXI, util, Deferred, log, wheelsData, Wheel, textureMaster, frameMaster, effectMaster, mediator) {

	var game = {

		wheels: [],

		original: {
			full: {
				w: 780,
				h: 520
			}
		},

		mode: 'dev', // dev || prod

		state: 'ready',

		beginDeltaTime: 300,
		endDeltaTime: -1,

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

			createjs.Ticker.setFPS(35);

			createjs.Ticker.addEventListener("tick", fn);

			if (this.mode === 'dev') {
				var fpsMeter = new FPSMeter();
				fpsMeter.showFps();
				createjs.Ticker.addEventListener("tick", fpsMeter.tick);
			}

		},

		bindEventListeners: function () {

			var game = this;

			mediator.installTo(game);

			game.subscribe('setting:game', function (data) {
				this[data.key] = data.value;
			});

			game.spinButton.addEventListener('click', game.spin.bind(game), false);

		},

		spin: function () {

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

			//console.log('game state is - ', state);

			this.state = state;

/*
			if (state === 'ready' || state === 'spin') {
				this.spinButton.className = 'spin-btn';
			} else {
				this.spinButton.className = 'spin-btn spin-btn_disabled';
			}
*/

		},

		beginSpin: function () {

			var game = this;

			var beginDeltaTime = game.beginDeltaTime;

			var wheels = game.wheels;

			wheels.forEach(function (wheel, index) {
				setTimeout(function () {
					wheel.beginSpin();
				}, beginDeltaTime * index);
			});

			wheels[wheels.length - 1].beginSpinCb = function () {
				game.setGameState('spin');
			};

		},

		endSpin: function () {

			var game = this;

			var wheels = game.wheels;

			var endDeltaTime = game.endDeltaTime;

			if (endDeltaTime === -1) {
				game.endSpinByStep();
			} else {
				game.endSpinByTime();
			}

			// show win animation
			wheels[wheels.length - 1].endSpinCb = function () {

				game.setGameState('ready');

				effectMaster.showWinClubs(game.getEndPositions());

				effectMaster.showFreeSpinPopUp();

			};

		},

		endSpinByStep: function () {

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

		},

		endSpinByTime: function () {

			var game = this;

			var wheels = game.wheels;

			var getEndPositions = game.getEndPositions();

			var endDeltaTime = game.endDeltaTime;

			wheels.forEach(function (wheel, index) {
				setTimeout(function () {
					wheel.endSpin(getEndPositions[index]);
				}, endDeltaTime * index);
			});

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
				width = game.original.full.w,
				height = game.original.full.h,
				renderer,
				stageMain, stageWheels, stageFrame, stageEffect;

			// init renderer
			renderer = new PIXI.autoDetectRenderer(width, height, {
				transparent: true,
				view: document.querySelector('.game-renderer'),
				resolution: textureMaster.resolution // set 2 or 3 to use higher resolution
				//,clearBeforeRender: false // right now canvas is cleared every tick,
				//,preserveDrawingBuffer: true // uncomment this (clearBeforeRender, preserveDrawingBuffer) if clearing is needless
			});
			game.renderer = renderer;

			// init main stage
			stageMain = new PIXI.Container();

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

				var newWheel = new Wheel({
					renderer: game.renderer,
					spritePosition: {
						x: wheelData.x,
						y: wheelData.y
					},
					hi: wheelData.hi,
					position: 0,
					stageWheels: game.stageWheels
				});

				wheels.push(newWheel);

				newWheel.updatePosition();

			});

		},

		redraw: function () {

			effectMaster.update();
			//frameMaster.update();

			var wheels = this.wheels,
				i, len;

			for (i = 0, len = wheels.length; i < len; i += 1) {
				wheels[i].updatePosition();
			}

			this.renderer.render(this.stageMain);

		}

	};

	return game;
});