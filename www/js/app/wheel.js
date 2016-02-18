import util from './../lib/util';
import itemsData from './items-data';
import wheelsData from './wheels-data';

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
	wheel.sIncrease = 0;
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

	wheel.innerStage = new PIXI.Container();

	wheel.bg = null;
	wheel.setBg('normal');

	wheel.stage.addChild(wheel.innerStage);

	wheel.items = [];
	wheel.size = 0;

	wheel.selfFill();

}

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

	//this.innerStage.position.y = this.getYPosition();
	this.detectVisibleItems(this.innerStage.position.y = this.getRoundPosition() * this.itemHeight | 0);

};

/*
 Wheel.prototype.getYPosition = function () {

 return this.getRoundPosition() * this.itemHeight | 0;

 };
 */



Wheel.prototype.setBg = function (type) {

	var wheel = this;

	var sprite = new PIXI.Sprite.fromFrame('wheels-' + type + '-bg-x' + wheel.hi);

	wheel.stage.addChild(sprite);

	//sprite.cacheAsBitmap = this;

	sprite.height = wheel.hi * wheelsData.item.h;

};

Wheel.prototype.detectVisibleItems = function (y) {

	var wheel = this;
	var hi = wheel.hi;
	var items = wheel.items;
	var item;

	var bottom = -y;
	var top = bottom + hi * wheel.itemHeight;

	for (var i = 0, len = items.length; i < len; i += 1) {

		item = items[i];

		if (item.top >= top || item.bottom <= bottom) {
			if (item.sprite.visible) {
				item.sprite.visible = false;
			}
		} else {
			if (!item.sprite.visible) {
				item.sprite.visible = true;
			}
		}

	}

};

Wheel.prototype.getNewItem = function (index) {

	var key = itemsData.list[index],
		itemData = itemsData[key],
		sprite = new PIXI.Sprite.fromFrame(itemData.frame);

	return {
		sprite: sprite,
		hi: itemData.hi,
		top: 0,
		bottom: 0
	};

};

Wheel.prototype.selfFill = function () {

	// todo: split this function to several procedures
	// 1 - create items
	// 2 (1.1) - create extra items
	// 3 - set default position of sprites

	var wheel = this;

	var realSizeInItems = Math.round(Math.random() * 10) + 7;

	var items = [];

	var i;

	var len;
	// magic block - begin

	// todo: note: try to use texture to fast change sprite state
	// see example here -> http://pixijs.github.io/examples/index.html?s=demos&f=texture-swap.js&title=Texture%20Swap

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

	// TODO: just mark first and last items - remove it for production
	//items[items.length - 1].sprite.alpha = 0.5;
	//items[0].sprite.alpha = 0.5;

	// magic block - end

	// count needed stage height
	var stageHeightInItems = -1; // reduce for last items
	items.forEach(function (item, index) {

		if (index) { // do not count zero extra item
			stageHeightInItems += item.hi;
		}

	});

	var stageHeightInPixels = stageHeightInItems * wheel.itemHeight;

	// set sprite positions
	items.forEach(function (item, index) {

		var sprite = item.sprite;

		wheel.innerStage.addChild(sprite);

		if (index) { // do not count zero extra item
			stageHeightInItems -= item.hi;
		}

		sprite.position.y = stageHeightInItems * wheel.itemHeight - wheelsData.item.itemDeltaTop - stageHeightInPixels + wheel.hi * wheel.itemHeight;

		item.top = stageHeightInItems * wheel.itemHeight - stageHeightInPixels + wheel.hi * wheel.itemHeight;
		item.bottom = item.top + item.hi * wheel.itemHeight;

	});

	wheel.items = items;

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

	wheel.updatePosition();

};

Wheel.prototype.updateSpinBegin = function () {

	var wheel = this;
	var T_INC = wheel.T_INC;

	var t = wheel.t + T_INC;
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

	wheel.sIncrease = v * T_INC;
	wheel.needStopping = false;
	wheel.t = 0;

	if (wheel.beginSpinCb) {
		wheel.beginSpinCb();
		wheel.beginSpinCb = null;
	}

};

Wheel.prototype.updateSpinMain = function () {

	this.position += this.sIncrease;

};

Wheel.prototype.endSpin = function (position) {

	var wheel = this;

	wheel.state = 'spin-end';
	wheel.t = 0;
	wheel.a = wheel.END_A;
	wheel.endSpinStopPosition = position;

};


Wheel.prototype.updateSpinEnd = function () {

	var wheel = this,
		v = wheel.v,
		T_INC = wheel.T_INC,
		t = wheel.t,
		position = wheel.position,
		sIncrease = wheel.sIncrease,
		needStopping = wheel.needStopping;

	if (!v) {
		return;
	}

	if (!needStopping) { // wait for position to begin ending

		position += sIncrease;

		wheel.position = position;

		// detect starting of ending
		var deltaPath = wheel.roundPosition(position + wheel.beginPath - wheel.endSpinStopPosition);

		if (Math.abs(deltaPath) >= sIncrease) {
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

	t += T_INC;

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


export default Wheel;