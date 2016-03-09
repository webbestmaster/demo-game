define(['./../lib/util', './items-data', './wheels-data', './texture-master', './../services/mediator'], function (util, itemsData, wheelsData, textureMaster, mediator) {

	function Wheel(data) {

		var wheel = this;

		wheel.config = JSON.parse(JSON.stringify(wheelsData.config));
		wheel.tween = null;

		wheel.itemHeight = wheelsData.item.h;
		wheel.itemHalfHeight = Math.floor(wheelsData.item.h / 2);

		wheel.position = 0; // get from dataArguments
		wheel.stageWheels = null; // get from dataArguments
		wheel.renderer = null; // get from dataArguments
		wheel.hi = 0; // get from dataArguments
		wheel.spritePosition = 0; // get from dataArguments

		wheel.state = '';
		wheel.t = 0;
		wheel.v = 0;
		wheel.a = 0;
		wheel.beginSpinStartPosition = 0;

		wheel.beginTime = 0;
		wheel.beginPath = 0;
		wheel.sInc = 0;
		wheel.tInc = 0; // will set by beginSpin
		wheel.needStopping = false;
		wheel.beginSpinCb = null;
		wheel.endSpinCb = null;

		wheel.endSpinStopPosition = 0;
		wheel.lastPosition = 0;
		wheel.deltaPath = 0;

		wheel.BEGIN_A = 0.5; // const, but can be set from setting view
		wheel.END_A = -0.5; // const, but can be set from setting view
		wheel.T_INC = 0.25; // const, but can be set from setting view
		wheel.V_MAX = 3; // const, but can be set from setting view
		wheel.easingPath = 3;

		util.eachHash(data, function (value, key) {
			wheel[key] = value;
		});

		wheel.items = [];
		wheel.items_blur = [];
		wheel.size = 0;

		wheel.tilingSpriteLink = null;

		wheel.ortiginalTilingSprite = null;
		wheel.ortiginalTilingSprite_blur = null;

		wheel.tilingSprite = null;
		wheel.tilingSprite_bonus = null;

		wheel.tilingSprite_blur = null;
		wheel.tilingSprite_blur_bonus = null;

		wheel.originalTexture = null;
		wheel.originalTexture_blur = null;

		wheel.tilingSpriteYOffset = 0;
		wheel.tilingSpriteYOffset_blur = 0;
		wheel.BLUR_Y_OFFSET = -5;

		//wheel.displayState = 'normal-normal';

		wheel.selfFill();

		wheel.setWheelDisplayState('normal-normal');

		mediator.installTo(wheel);

		wheel.bindEventListeners();

	}

	Wheel.prototype.bindEventListeners = function () {

		var wheel = this;

		wheel.subscribe('setting:wheel', function (data) {
			this.config[data.period][data.key] = data.value;
		});

		wheel.subscribe('setting:timingFunction', function (data) {
			var timingFunction = this.config[data.period].timingFunction;
			timingFunction.name = data.value;
			timingFunction.args = data.args;
		});

	};

	Wheel.prototype.pushPrototypeMethods = function () {

		var wheel = this;
		var proto = wheel.constructor.prototype;

		var excludedMethods = [
			'selfFill',
			'adjustSizes',
			'pushPrototypeMethods',
			'getNewItem',
			'createItemContainer',
			'getWheelSizeInItems',
			'getRawItems',
			'bindEventListeners'
		];

		var key;

		for (key in proto) {
			if (proto.hasOwnProperty(key) && excludedMethods.indexOf(key) === -1) {
				wheel[key] = proto[key];
			}
		}

	};

	Wheel.prototype.updatePosition = function () {
		return this.tilingSpriteLink.tilePosition.y = this.tilingOffsetYLink + this.position * this.itemHeight;
	};

	Wheel.prototype.getNewItem = function (data) {

		var wheel = this,
			index = data.index,
			state = data.state,
			key = itemsData.list[index],
			itemData = itemsData[key],
			sprite;

		if (state === 'normal') {
			sprite = new PIXI.Sprite.fromFrame(itemData.frame + '.png');
		}

		if (state === 'blur') {
			sprite = new PIXI.Sprite.fromFrame(itemData.frame + '_blur.png');
		}

		wheel.adjustSizes(sprite);

		return {
			offset: itemData.offset,
			sprite: sprite,
			hi: itemData.hi
		};

	};

	Wheel.prototype.adjustSizes = function (sprite) {

		sprite.height = Math.round(sprite.height * wheelsData.item.w / sprite.width);
		sprite.width = wheelsData.item.w;

	};

	Wheel.prototype.getRawItems = function () {

		var realSizeInItems = Math.floor(Math.random() * 5) + 15;

		var items = [];

		var i;

		// add "real" items
		for (i = 0; i < realSizeInItems; i += 1) {
			items.push(i);
		}

		items = items.sort(function () {
			return Math.random() - 0.5;
		});

		// add zero hidden item
		// add object the same as last object to start of arr
		items.unshift(items[items.length - 1]);

		return items;

	};

	Wheel.prototype.selfFill = function () {

		var wheel = this;

		var rawItems = wheel.getRawItems();

		var items = rawItems.map(function (item) {
			return wheel.getNewItem({
				index: item % itemsData.list.length,
				state: 'normal'
			});
		});

		var itemsBlur = rawItems.map(function (item) {
			return wheel.getNewItem({
				index: item % itemsData.list.length,
				state: 'blur'
			});
		});

		wheel.size = wheel.getWheelSizeInItems(items);

		wheel.createItemContainer({
			items: items,
			type: 'normal'
		});

		wheel.createItemContainer({
			items: itemsBlur,
			type: 'blur'
		});

		wheel.tilingSpriteLink = wheel.tilingSprite;

		wheel.stageWheels.addChild(wheel.tilingSprite);
		wheel.stageWheels.addChild(wheel.tilingSprite_bonus);
		wheel.stageWheels.addChild(wheel.tilingSprite_blur);
		wheel.stageWheels.addChild(wheel.tilingSprite_blur_bonus);

	};

	Wheel.prototype.createItemContainer = function (data) {

		// TODO: refactor this code

		var items = data.items;

		var type = data.type;

		var postfix = type === 'blur' ? '_blur' : '';

		var wheel = this;

		var stageHeightInItems = 0;

		var blurYOffset = type === 'blur' ? wheel.BLUR_Y_OFFSET : 0;

		items.forEach(function (item, index) {
			// do not count zero extra item
			return index && (stageHeightInItems += item.hi);
		});

		var stageHeightInPixels = stageHeightInItems * wheel.itemHeight;

		var innerStage = new PIXI.Container();

		// set sprite positions
		items.forEach(function (item, index) {

			var sprite = item.sprite;

			innerStage.addChild(sprite);

			if (index) { // do not count zero extra item
				stageHeightInItems -= item.hi;
			}

			sprite.position.x = item.offset.x;
			// get full height in pixel 		// reduce by rest of	// add item sprite offset
			sprite.position.y = stageHeightInItems * wheel.itemHeight - stageHeightInPixels + item.offset.y;

		});

		// set last of items
		wheel['tilingSpriteYOffset' + postfix] = items[0].offset.y - wheel.itemHalfHeight + blurYOffset;

		wheel['items' + postfix] = items;

		innerStage.children = innerStage.children.reverse();

		var baseTexture = innerStage.generateTexture(wheel.renderer, 1, PIXI.SCALE_MODES.DEFAULT);

		var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, wheel.itemHalfHeight, wheelsData.item.w, stageHeightInPixels));

		wheel['originalTexture' + postfix] = texture;

		var tilingSprite = new PIXI.extras.TilingSprite(texture);

		tilingSprite.position.x = wheel.spritePosition.x;
		tilingSprite.position.y = wheel.spritePosition.y;

		tilingSprite.width = wheelsData.item.w;
		tilingSprite.height = wheel.hi * wheel.itemHeight;

		wheel['originalTilingSprite' + postfix] = tilingSprite;

		// add bg
		var bgTilingSprite = new PIXI.extras.TilingSprite.fromFrame('wheels-bg-normal', wheelsData.item.w, stageHeightInPixels + wheel.itemHeight);

		var bgTilingSprite_bonus = new PIXI.extras.TilingSprite.fromFrame('wheels-bg-bonus', wheelsData.item.w, stageHeightInPixels + wheel.itemHeight);

		bgTilingSprite.position.y = bgTilingSprite_bonus.position.y = -stageHeightInPixels;

		bgTilingSprite.tileScale.x = bgTilingSprite_bonus.tileScale.x = 1 / textureMaster.resolution;

		[bgTilingSprite, bgTilingSprite_bonus].forEach(function (bgSprite, index) {

			var bgPostfix = '';

			if (index === 1) {
				innerStage.removeChildAt(0);
				bgPostfix = '_bonus';
			}

			innerStage.addChildAt(bgSprite, 0);

			var baseTexture = innerStage.generateTexture(wheel.renderer, textureMaster.resolution, PIXI.SCALE_MODES.DEFAULT);

			var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, wheel.itemHalfHeight, wheelsData.item.w, stageHeightInPixels));

			wheel['originalTexture' + postfix] = texture;

			var tilingSprite = new PIXI.extras.TilingSprite(texture);

			tilingSprite.position.x = wheel.spritePosition.x;
			tilingSprite.position.y = wheel.spritePosition.y;

			tilingSprite.width = wheelsData.item.w;
			tilingSprite.height = wheel.hi * wheel.itemHeight;

			wheel['tilingSprite' + postfix + bgPostfix] = tilingSprite;

		});

	};

	Wheel.prototype.getWheelSizeInItems = function (items) {

		var i,
			len,
			sum = 0;

		for (i = 0, len = items.length - 1; i < len; i += 1) {
			sum += items[i].hi;
		}

		return sum;

	};

	Wheel.prototype.setWheelDisplayState = function (state) {

		switch (state) {

			case 'normal-normal':

				this.tilingSpriteLink = this.tilingSprite;
				this.tilingOffsetYLink = this.tilingSpriteYOffset;

				this.tilingSprite.visible = true;
				this.tilingSprite_bonus.visible = false;
				this.tilingSprite_blur.visible = false;
				this.tilingSprite_blur_bonus.visible = false;

				break;

			case 'normal-bonus':

				this.tilingSpriteLink = this.tilingSprite_bonus;
				this.tilingOffsetYLink = this.tilingSpriteYOffset;

				this.tilingSprite.visible = false;
				this.tilingSprite_bonus.visible = true;
				this.tilingSprite_blur.visible = false;
				this.tilingSprite_blur_bonus.visible = false;

				break;

			case 'blur-normal':

				this.tilingSpriteLink = this.tilingSprite_blur;
				this.tilingOffsetYLink = this.tilingSpriteYOffset_blur;

				this.tilingSprite.visible = false;
				this.tilingSprite_bonus.visible = false;
				this.tilingSprite_blur.visible = true;
				this.tilingSprite_blur_bonus.visible = false;

				break;

			case 'blur-bonus':

				this.tilingSpriteLink = this.tilingSprite_blur_bonus;
				this.tilingOffsetYLink = this.tilingSpriteYOffset_blur;

				this.tilingSprite.visible = false;
				this.tilingSprite_bonus.visible = false;
				this.tilingSprite_blur.visible = false;
				this.tilingSprite_blur_bonus.visible = true;

				break;

		}

		//this.displayState = state;

	};

	Wheel.prototype.beginSpin = function () {

		/*
		 *
		 * http://www.createjs.com/demos/tweenjs/tween_sparktable
		 *
		 * getElasticIn get 2 parameters - amplitude, period
		 * d - down, u - up
		 * 1, 1.0 dud
		 * 1, 0.7 udud
		 * 1, 0.5 dudud
		 * 1, 0.4 ududud
		 * 1, 0.3 dududud
		 *
		 * getBackIn get 1 parameter - amount
		 * number - ud
		 * negative number - d
		 *
		 * */

		this.position %= this.size;

		var beginCfg = this.config.begin;

		// begin tween
		createjs.Tween
			.get(this, {loop: false, override: true}) // override: true - remove another tweens from target
			.to(
				{position: this.position + beginCfg.linearPathSize},
				beginCfg.time * beginCfg.timeAspect,
				this.getTimingFunction(beginCfg.timingFunction.name, beginCfg.timingFunction.args)
			)
			.call(this.onBeginTweenEnd);

	};

	Wheel.prototype.onBeginTweenEnd = function () {

		var mainCfg = this.config.main,
			tween = createjs.Tween
				.get(this, {loop: true, override: true})
				.to({position: this.position + this.size}, this.size / mainCfg.speed * mainCfg.timeAspect * 1000, createjs.Ease.linear);

		this.tween = tween;

		tween.on('stop', this.onStop);

		if (this.beginSpinCb) {
			this.beginSpinCb();
			this.beginSpinCb = null;
		}

		//tween.on('change', function (e) {
		//console.log(arguments);
		//});

	};

	Wheel.prototype.onStop = function (e) {

		var wheel = e.target.target;

		var endCfg = wheel.config.end;

		var endPosition = wheel.endPosition + wheel.size;

		wheel.position = endPosition - endCfg.linearPathSize;

		// end spin
		var endTween = createjs.Tween
			.get(wheel, {loop: false, override: true})
			.to(
				{position: endPosition},
				endCfg.time * endCfg.timeAspect,
				wheel.getTimingFunction(endCfg.timingFunction.name, endCfg.timingFunction.args)
			)
			.call(function () {
				if (this.endSpinCb) {
					this.endSpinCb();
					this.endSpinCb = null;
				}
			});

		// todo: add time shift to setting view
		if ( endCfg.timingFunction.name === 'bounceOut' ) {
			endTween.setPosition(endCfg.time * endCfg.timeAspect * 0.30);
		}

	};

	Wheel.prototype.endSpin = function (position) {

		this.endPosition = position;
		this.tween.dispatchEvent('stop');

	};

	Wheel.prototype.timeingFunctionsCache = {};

	Wheel.prototype.getTimingFunction = function (name, args) {

		// no any args - return predefined function
		if (!args) {
			return createjs.Ease[name];
		}

		// args look like [1, 2, 3]
		if (args.length) {
			return this.timeingFunctionsCache[name + args.join()] ||
				(this.timeingFunctionsCache[name + args.join()] = createjs.Ease[name].apply(createjs.Ease, args));
		}

		// args is []
		return this.timeingFunctionsCache[name + '[]'] ||
			(this.timeingFunctionsCache[name + '[]'] = createjs.Ease[name]());

	};

	return Wheel;
});