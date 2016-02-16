import PIXI from './../lib/pixi';
import util from './../lib/util';
import Deferred from './../lib/deferred';
import log from './../services/log';
import wheelsData from './wheels-data';
import Wheel from './wheel';
import textureMaster from './texture-master';
import frameMaster from './frame-master';
import effectMaster from './effect-master';
import gameTextures from './game-textures';

var game = {

	//wheelsData: wheelsData,

	wheels: [],

	original: {
		full: {
			w: 780,
			h: 520
		}
	},

	i: true,

	state: 'ready',

	//isAnimate: false,

	initialize: function (cd) {

		var game = this;

		game.animateWheels = game.animateWheels.bind(game);

		game.initCanvas();

		game.redraw = game.redraw.bind(game);

		textureMaster.initTextures().done(function () {
			frameMaster.initSprites();
			effectMaster.initSprites();
			game.createWheels();
			game.redraw();
			game.bindEventListeners();
			cd();
		});

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

			if (Math.random() > 0.07) {
				effectMaster.showFreeSpinPopUp();
			}

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

/*
	startAnimateWheels: function () {

		var game = this;

		game.isAnimate = true;

		game.animateWheels();

	},
*/

	animateWheels: function () {

		//if (this.isAnimate) {

			requestAnimationFrame(this.animateWheels);

			var wheels = this.wheels;

			for (var i = 0, len = wheels.length; i < len; i += 1) {
				wheels[i].updatePosition();
			}

		//}

	},

	initCanvas: function () {

		var game = this,
			q = 1,
			width = game.original.full.w * q,
			height = game.original.full.h * q,
			renderer,
			stageMain, stageWheels, stageFrame, stageEffect;

		// init renderer
		renderer = PIXI.autoDetectRenderer(width, height, {
			transparent: true,
			view: document.querySelector('.game-renderer'),
			resolution: 1 // set 2 or 3 to use higher resolution
		});
		game.renderer = renderer;

		// init main stage
		stageMain = new PIXI.Container();
		stageMain.scale.x = q;
		stageMain.scale.y = q;

		// init child stages
		stageWheels = new PIXI.Container();
		stageFrame = new PIXI.Container();
		stageEffect = new PIXI.Container();
/*
		stageEffect = new PIXI.ParticleContainer(100, {
			uvs: true
		});
*/

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
		var mainSpriteTexture = gameTextures.textures.mainSprite.texture.texture;

		wheelsData.wheels.forEach(function (wheelData) {

			var tilingSprite = new PIXI.extras.TilingSprite(mainSpriteTexture, wheelsData.item.w, wheelData.hi * wheelsData.item.h);

			tilingSprite.position.x = wheelData.x;
			tilingSprite.position.y = wheelData.y;

			game.stageWheels.addChild(tilingSprite);

			var newWheel = new Wheel({
				itemHeight: wheelsData.item.h,
				position: Math.floor(Math.random() * wheelsData.wheelItemCount),
				tilingSprite: tilingSprite,
				wheelItemCount: wheelsData.wheelItemCount
			});

			wheels.push(newWheel);

			newWheel.updatePosition();

		});

	},

	redraw: function () {

		requestAnimationFrame(this.redraw);

		effectMaster.update();
		frameMaster.update();
/*
		// do not each frame, draw odd frame only
		if (this.i = !this.i) { // here use single "=" for small optimization
			return;
		}
*/

		var wheels = this.wheels,
			i, len;

		for (i = 0, len = wheels.length; i < len; i += 1) {
			wheels[i].updatePosition();
		}

		this.renderer.render(this.stageMain);

	}

};

export default game;