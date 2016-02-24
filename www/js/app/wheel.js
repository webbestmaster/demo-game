define (['./../lib/util', './items-data', './wheels-data'], function (util, itemsData, wheelsData) {


	
	function Wheel(data) {

		var wheel = this;

		wheel.itemHeight = 0; // get from dataArguments
		wheel.position = 0; // get from dataArguments
		wheel.stage = null; // get from dataArguments
		wheel.hi = 0; // get from dataArguments

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
		wheel.T_INC = 0.1; // const
		wheel.V_MAX = 3; // const

		//wheel.BEGIN_A = 0.2; // const
		//wheel.END_A = -0.2; // const
		//wheel.T_INC = 0.1; // const
		//wheel.V_MAX = 3.1; // const

		util.eachHash(data, function (value, key) {
			wheel[key] = value;
		});

		wheel.bgStage = new PIXI.Container();
		wheel.innerStage = new PIXI.Container();

		wheel.texture = null;
		wheel.prepareTextures();

		wheel.stage.addChild(wheel.bgStage);
		wheel.stage.addChild(wheel.innerStage);

		wheel.items = [];
		wheel.size = 0;

		wheel.selfFill();

		wheel.setBlurState('normal');
		//playing with gl filters
/*
		wheel.currentFilter = new PIXI.filters.BlurYFilter();
		wheel.currentFilter.blur = 1;
		wheel.innerStage.filters = [wheel.currentFilter];
*/

		wheel.pushPrototypeMethods();

		wheel.setBg('normal');

	}

	Wheel.prototype.pushPrototypeMethods = function () {

		var wheel = this;
		var proto = wheel.constructor.prototype;

		var excludedMethods = [
			'selfFill',
			'pushPrototypeMethods',
			'prepareTextures',
			'getNewItem'
		];

		var key;

		for (key in proto) {
			if (proto.hasOwnProperty(key) && excludedMethods.indexOf(key) === -1) {
				wheel[key] = proto[key];
			}
		}

	};

	// all textures created for each wheel
	Wheel.prototype.prepareTextures = function () {

		var wheel = this;

		wheel.texture = {
			bg: {
				normal: new PIXI.Texture.fromFrame('wheels-bg-normal'),
				bonus: new PIXI.Texture.fromFrame('wheels-bg-bonus')
			}
		};

		var item = wheel.texture.item = {
			normal: {},
			blur: {}
		};

		itemsData.list.forEach(function (key) {

			var itemData = itemsData[key];

			item.normal[key] = new PIXI.Texture.fromFrame(itemData.frame);
			item.blur[key] = new PIXI.Texture.fromFrame(itemData.frame + '_blur');

		});

	};

	Wheel.prototype.setBlurState = function (state) {

		var wheel = this;

		var item;
		var items = wheel.items;

		var itemTextures = wheel.texture.item[state];

		var i, len;

		for (i = 0, len = items.length; i < len; i += 1) {
			item = items[i];
			item.sprite.texture = itemTextures[item.key]
		}

	};

	Wheel.prototype.setBg = function (type) {

		var wheel = this;

		var texture = wheel.texture.bg[type];

		var children = wheel.bgStage.children;

		var i, len;

		for (i = 0, len = children.length; i < len; i += 1) {
			children[i].texture = texture;
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

		var roundPosition = this.getRoundPosition();

		this.bgStage.position.y = this.innerStage.position.y = roundPosition * this.itemHeight | 0;

		this.detectVisibleItems(Math.ceil(roundPosition));

	};

	Wheel.prototype.detectVisibleItems = function (roundPosition) {

		if (this.lastDetectVisiblePosition === roundPosition) {
			return;
		}

		this.lastDetectVisiblePosition = roundPosition;

		var wheel = this;

		var hi = wheel.hi;
		var items = wheel.items;
		var item;

		var itemHeight = wheel.itemHeight;

		var bottom = -roundPosition * itemHeight;
		var top = bottom + ( hi + 1) * itemHeight;

		var sprite;
		var bg;

		for (var i = 0, len = items.length; i < len; i += 1) {

			item = items[i];

			sprite = item.sprite;
			bg = item.bg.sprite;

			if (item.top >= top || item.bottom <= bottom) {
				if (sprite.visible) {
					bg.visible = sprite.visible = false;
				}
			} else {
				if (!sprite.visible) {
					bg.visible = sprite.visible = true;
				}
			}

		}

	};

	Wheel.prototype.getNewItem = function (index) {

		var key = itemsData.list[index],
			itemData = itemsData[key],
			sprite = new PIXI.Sprite.fromFrame(itemData.frame),
			bg = itemData.bg ?
				new PIXI.extras.TilingSprite.fromFrame('wheels-bg-normal',  wheelsData.item.w, itemData.bg.h) :
				null;

		return {
			key: key,
			//frameName: itemData.frame,
			offset: itemData.offset,
			sprite: sprite,
			hi: itemData.hi,
			top: 0,
			bottom: 0,
			bg: {
				sprite: bg,
				offset: itemData.bg.offset
			}
		};

	};

	Wheel.prototype.selfFill = function () {

		var wheel = this;

		var realSizeInItems = Math.round(Math.random() * 20) + 5;

		var items = [];

		var i;

		var len;
		// magic block - begin

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
		for (i = 1, len = wheel.hi + 1; i <= len; i += 1) { // i = 1, i <= len !!, it is not a mistake
			items.push(items[i]);
		}

		items = items.map(function (item) {
			return wheel.getNewItem(item % itemsData.list.length);
		});

		for (i = 1; i <= realSizeInItems; i += 1) {
			wheel.size += items[i].hi;
		}

		// magic block - end

		// count needed stage height
		var stageHeightInItems = -1; // reduce for last items
		items.forEach(function (item, index) {

			if (index) { // do not count zero extra item
				stageHeightInItems += item.hi;
			}

		});

		var stageHeightInPixels = stageHeightInItems * wheel.itemHeight;

		var innerStage = wheel.innerStage;
		var bgStage = wheel.bgStage;

		// set sprite positions
		items.forEach(function (item, index) {

			var sprite = item.sprite;
			var bg = item.bg.sprite;

			innerStage.addChild(sprite);

			if (index) { // do not count zero extra item
				stageHeightInItems -= item.hi;
			}

			sprite.position.x = item.offset.x;
			sprite.position.y = stageHeightInItems * wheel.itemHeight - wheelsData.item.itemDeltaTop - stageHeightInPixels + wheel.hi * wheel.itemHeight + item.offset.y;

			item.top = stageHeightInItems * wheel.itemHeight - stageHeightInPixels + wheel.hi * wheel.itemHeight;
			item.bottom = item.top + item.hi * wheel.itemHeight;

			bgStage.addChild(bg);
			bg.position.y = stageHeightInItems * wheel.itemHeight - stageHeightInPixels + wheel.hi * wheel.itemHeight + item.bg.offset.y;

			bg.visible = false;
			sprite.visible = false;

		});

		wheel.items = items;

		// reverse draw order
		innerStage.children = innerStage.children.reverse();

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

		wheel.setBlurState('blur');
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

		wheel.setBlurState('normal');
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