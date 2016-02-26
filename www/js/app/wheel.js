define(['./../lib/util', './items-data', './wheels-data'], function (util, itemsData, wheelsData) {

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
		wheel.T_INC = 0.2; // const
		wheel.V_MAX = 3; // const

		//wheel.BEGIN_A = 0.2; // const
		//wheel.END_A = -0.2; // const
		//wheel.T_INC = 0.1; // const
		//wheel.V_MAX = 3.1; // const

		util.eachHash(data, function (value, key) {
			wheel[key] = value;
		});

		wheel.items = [];
		wheel.size = 0;

		wheel.tilingSprite = null;
		wheel.originalTexture = null;

		wheel.selfFill();

	}

	Wheel.prototype.pushPrototypeMethods = function () {

		var wheel = this;
		var proto = wheel.constructor.prototype;

		var excludedMethods = [
			'selfFill',
			'pushPrototypeMethods',
			'getNewItem'
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

		this.tilingSprite.tilePosition.y = Math.floor(this.tilingSpriteYOffset + this.getRoundPosition() * this.itemHeight);

	};

	Wheel.prototype.getNewItem = function (index) {

		var key = itemsData.list[index],
			itemData = itemsData[key],
			sprite = new PIXI.Sprite.fromFrame(itemData.frame);

		return {
			offset: itemData.offset,
			sprite: sprite,
			hi: itemData.hi
		};

	};

	Wheel.prototype.selfFill = function () {

		var wheel = this;

		var realSizeInItems = Math.floor(Math.random() * 20) + 30;

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

		// add last items, the same as first items
		items = items.map(function (item) {
			return wheel.getNewItem(item % itemsData.list.length);
		});

		for (i = 1; i <= realSizeInItems; i += 1) {
			wheel.size += items[i].hi;
		}

		// count needed stage height
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
		wheel.tilingSpriteYOffset = items[0].offset.y - wheel.itemHalfHeight;

		wheel.items = items;

		// reverse draw order
		innerStage.children = innerStage.children.reverse();

		var baseTexture = innerStage.generateTexture(wheel.renderer, 1, PIXI.SCALE_MODES.DEFAULT);

		var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, wheel.itemHalfHeight, wheelsData.item.w, stageHeightInPixels));

		wheel.originalTexture = texture;

		var tilingSprite = new PIXI.extras.TilingSprite(texture);

		tilingSprite.position.x = wheel.spritePosition.x;
		tilingSprite.position.y = wheel.spritePosition.y;

		tilingSprite.width = wheelsData.item.w;
		tilingSprite.height = wheel.hi * wheel.itemHeight;

		wheel.tilingSprite = tilingSprite;

		wheel.stageWheels.addChild(tilingSprite);

		// TODO: add several different textures with different state

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

	Wheel.prototype.beginSpin = function (data) {

		var wheel = this;

		wheel.position = wheel.getRoundPosition();
		wheel.state = 'spin-begin';
		wheel.t = 0;
		wheel.v = 0;
		wheel.a = wheel.BEGIN_A;
		wheel.beginSpinStartPosition = wheel.position;
		wheel.tInc = wheel.T_INC / data.scaleFPS;

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
		var position = wheel.beginSpinStartPosition + v * t / 2 - Math.sin(v / V_MAX * Math.PI) * 1.2;

		wheel.position = position;

		wheel.t = Math.round(t * 100) / 100;

		if (v < V_MAX) {
			return;
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

		var a = wheel.a;

		position = wheel.lastPosition + v * t + a * t * t / 2;
		position += wheel.deltaPath * ( a * t / v );
		position -= Math.sin((v - a * t) / v * Math.PI) * 1.2;

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