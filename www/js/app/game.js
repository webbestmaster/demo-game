import PIXI from './../lib/pixi';
import util from './../lib/util';
import Deferred from './../lib/deferred';
import EndlessArray from './../lib/endless-array';
import log from './../services/log';
import wheelsData from './wheels-data';
import Wheel from './wheel';
import textureMaster from './texture-master';
import frameMaster from './frame-master';
import effectMaster from './effect-master';
import gameTextures from './game-textures';

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

	},

	initTicker: function (fn) {

		var game = this;

		var ticker = new PIXI.ticker.Ticker();

		ticker.add(fn);


		//todo: detect dev mode to avoid it - begin
		game.addFPSNode();
		ticker.add(function () {
			// update fps node
			var fps = game.fps;
			fps.counter += 1;
			if (fps.counter < 10) {
				return;
			}
			fps.counter = 0;

			var log = fps.log;

			var tickerFPS = ticker.FPS;
			var displayedFps = tickerFPS .toFixed(1);
			var averageDisplayedFps = (log.average() || 0).toFixed(1);
			log.push(tickerFPS);

			fps.node.textContent = displayedFps + '\n' + averageDisplayedFps;

		});
		//todo: detect dev mode to avoid it - end


		ticker.start();

		game.ticker = ticker;

	},

	addFPSNode: function () {

		var game = this;

		var fpsNode = document.createElement('div');

		fpsNode.textContent = '0.0';
		fpsNode.className = 'fps-meter';

		document.body.appendChild(fpsNode);

		game.fps = {
			node: fpsNode,
			counter: 0,
			log: new EndlessArray(10)
		};

	},

	bindEventListeners: function () {

		var game = this;

		document.querySelector('.js-spin').addEventListener('click', function () {

			game.spin();

		}, false);

	},

	spin: function () {

		var game = this,
			spinState = game.state;

		switch (spinState) {

			case 'ready':

				effectMaster.hideClips();

				game.state = 'spin-begin';

				game.beginSpin();

				break;

			case 'spin':

				game.state = 'spin-end';

				game.endSpin();

				break;

		}

	},

	beginSpin: function () {

		var game = this;

		var wheels = game.wheels;

		wheels.forEach(function (wheel, index) {
			setTimeout(function () {
				wheel.beginSpin();
			}, 300 * index);
		});

		wheels[wheels.length - 1].beginSpinCb = function () {
			game.state = 'spin';
			console.log('collection state is - spin');
		};

	},

	endSpin: function () {

		var game = this;

		var wheels = game.wheels;

		var getEndPositions = game.getEndPositions();

		wheels.forEach(function (wheel, index) {
			setTimeout(function () {
				wheel.endSpin(getEndPositions[index]);
			}, 500 * index);
		});

		wheels[wheels.length - 1].endSpinCb = function () {
			game.state = 'ready';

			effectMaster.showWinClubs(getEndPositions);

			effectMaster.showFreeSpinPopUp();

			console.log('collection state is - ready');

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

export default game;