define(['./../lib/util', './items-data', './wheels-data', './texture-master'], function (util, itemsData, wheelsData, textureMaster) {

	function Wheel(data) {

		var wheel = this;

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

		//wheel.BEGIN_A = 0.1; // const
		//wheel.END_A = -0.1; // const
		//wheel.T_INC = 0.05; // const
		//wheel.V_MAX = 1; // const
		wheel.BEGIN_A = 0.5; // const
		wheel.END_A = -0.5; // const
		wheel.T_INC = 0.15; // const
		wheel.V_MAX = 3; // const

		//wheel.BEGIN_A = 0.2; // const
		//wheel.END_A = -0.2; // const
		//wheel.T_INC = 0.1; // const
		//wheel.V_MAX = 3.1; // const

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

		wheel.displayState = 'normal-normal';

		wheel.selfFill();

		wheel.setWheelDisplayState('normal-normal');

	}

	Wheel.prototype.pushPrototypeMethods = function () {

		var wheel = this;
		var proto = wheel.constructor.prototype;

		var excludedMethods = [
			'selfFill',
			'pushPrototypeMethods',
			'getNewItem',
			'createItemContainer',
			'getWheelSizeInItems',
			'getRawItems'
		];

		var key;

		for (key in proto) {
			if (proto.hasOwnProperty(key) && excludedMethods.indexOf(key) === -1) {
				wheel[key] = proto[key];
			}
		}

	};


	Wheel.prototype.updatePosition = function () {

		switch (this.state) {
			case 'spin-begin':

				this.updateSpinBegin();

				break;

			case 'spin-main':

				this.updateSpinMain();

				break;

			case 'spin-end':

				this.updateSpinEnd();

				break;

		}

		this.tilingSpriteLink.tilePosition.y = Math.floor(this.tilingSpriteYOffset + this.getRoundPosition() * this.itemHeight);

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

		sprite.height = Math.round(sprite.height * wheelsData.item.w / sprite.width );
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

		var postfix = data.type === 'blur' ? '_blur' : '';

		var wheel = this;

		var stageHeightInItems = 0;

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
		wheel['tilingSpriteYOffset' + postfix] = items[0].offset.y - wheel.itemHalfHeight;

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


	Wheel.prototype.getRoundPosition = function () {

		var position = this.position;
		var size = this.size;

		if (position <= size) {
			return position;
		}

		return position % size;

	};

	Wheel.prototype.roundPosition = function (position) {

		var size = this.size;

		if (position <= size) {
			return position;
		}

		return position % size;

	};

	Wheel.prototype.beginSpin = function () {

		var wheel = this;

		wheel.position = wheel.getRoundPosition();
		wheel.state = 'spin-begin';
		wheel.t = 0;
		wheel.v = 0;
		wheel.a = wheel.BEGIN_A;
		wheel.beginSpinStartPosition = wheel.position;
		wheel.tInc = wheel.T_INC;

		wheel.updatePosition();

		//wheel.setBlurState('blur');
		//wheel.currentFilter.blur = 6;    //blurring while it spins

	};

	Wheel.prototype.updateSpinBegin = function () {

		var wheel = this;
		var tInc = wheel.tInc;

		var t = wheel.t + tInc;
		var a = wheel.a;
		var v = a * t;
		var V_MAX = wheel.V_MAX;
		var position = wheel.beginSpinStartPosition + v * t / 2 - Math.sin(v / V_MAX * Math.PI) * 3;

		wheel.position = position;

		wheel.t = Math.round(t * 100) / 100;

		if (v < V_MAX) {
			return;
		}

		// add blur
		if (wheel.displayState !== 'blur-normal'){
			wheel.setWheelDisplayState('blur-normal');
		}

		wheel.v = v;
		wheel.state = 'spin-main';

		wheel.beginTime = wheel.t;

		wheel.beginPath = position - wheel.beginSpinStartPosition;

		wheel.sInc = v * tInc;
		wheel.needStopping = false;
		wheel.t = 0;

		if (wheel.beginSpinCb) {
			wheel.beginSpinCb();
			wheel.beginSpinCb = null;
		}

	};

	Wheel.prototype.setWheelDisplayState = function (state) {

		switch (state) {

			case 'normal-normal':

				this.tilingSpriteLink = this.tilingSprite;

				this.tilingSprite.visible = true;
				this.tilingSprite_bonus.visible = false;
				this.tilingSprite_blur.visible = false;
				this.tilingSprite_blur_bonus.visible = false;

				break;

			case 'normal-bonus':

				this.tilingSpriteLink = this.tilingSprite_bonus;

				this.tilingSprite.visible = false;
				this.tilingSprite_bonus.visible = true;
				this.tilingSprite_blur.visible = false;
				this.tilingSprite_blur_bonus.visible = false;

				break;

			case 'blur-normal':

				this.tilingSpriteLink = this.tilingSprite_blur;

				this.tilingSprite.visible = false;
				this.tilingSprite_bonus.visible = false;
				this.tilingSprite_blur.visible = true;
				this.tilingSprite_blur_bonus.visible = false;

				break;

			case 'blur-bonus':

				this.tilingSpriteLink = this.tilingSprite_blur_bonus;

				this.tilingSprite.visible = false;
				this.tilingSprite_bonus.visible = false;
				this.tilingSprite_blur.visible = false;
				this.tilingSprite_blur_bonus.visible = true;

				break;

		}

		this.displayState = state;

	};

	Wheel.prototype.updateSpinMain = function () {

		this.position += this.sInc;

	};

	Wheel.prototype.endSpin = function (position) {

		var wheel = this;

		wheel.state = 'spin-end';
		wheel.t = 0;
		wheel.a = wheel.END_A;
		wheel.endSpinStopPosition = position;

		//wheel.setBlurState('normal');
		//wheel.currentFilter.blur = 1;

	};

	Wheel.prototype.updateSpinEnd = function () {

		var wheel = this,
			v = wheel.v,
			tInc = wheel.tInc,
			t = wheel.t,
			position = wheel.position,
			sInc = wheel.sInc,
			needStopping = wheel.needStopping;

		if (!v) {
			return;
		}

		if (!needStopping) { // wait for position to begin ending

			position += sInc;

			wheel.position = position;

			// detect starting of ending
			var deltaPath = wheel.roundPosition(position + wheel.beginPath - wheel.endSpinStopPosition);

			if (Math.abs(deltaPath) >= sInc) {
				return;
			}

			wheel.lastPosition = position;
			wheel.needStopping = true;
			wheel.deltaPath = deltaPath;

			return;

		}

		// remove blur
		if (wheel.displayState !== 'normal-normal'){
			wheel.setWheelDisplayState('normal-normal');
		}

		var a = wheel.a;

		position = wheel.lastPosition + v * t + a * t * t / 2;
		position += wheel.deltaPath * ( a * t / v );
		position -= Math.sin((v - a * t) / v * Math.PI) * 3;

		wheel.position = position;

		t += tInc;

		wheel.t = (Math.round(t * 100) / 100);

		if (t <= wheel.beginTime) {
			return;
		}

		wheel.position = wheel.endSpinStopPosition;
		wheel.v = 0;
		wheel.t = 0;

		if (wheel.endSpinCb) {
			wheel.endSpinCb();
			wheel.endSpinCb = null;
		}

	};

	return Wheel;
});