import util from './../lib/util';
import itemsData from './items-data';

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

	wheel.BEGIN_A = 0.5; // const
	wheel.END_A = -0.5; // const
	wheel.T_INC = 0.1; // const
	wheel.V_MAX = 5; // const

	//wheel.BEGIN_A = 0.2; // const
	//wheel.END_A = -0.2; // const
	//wheel.T_INC = 0.1; // const
	//wheel.V_MAX = 3.1; // const

	util.eachHash(data, function (value, key) {
		wheel[key] = value;
	});

	wheel.selfFill();

}

Wheel.prototype.getNewItem = function (index) {

	var key = itemsData.list[index],
		itemData = itemsData[key],
		sprite = new PIXI.Sprite.fromFrame(itemData.frame);

	return {
		sprite: sprite,
		hi: itemData.hi
	};

};

Wheel.prototype.selfFill = function () {

	// todo: split this function to several procedures
	// 1 - create items
	// 2 (1.1) - create extra items
	// 3 - set default position of sprites

	var wheel = this;

	var realSizeInItems = Math.round(Math.random() * 10 + 5);

	var items = [];

	var i;

	var len;
	// magic block - begin

	// todo: note: try to use texture to fast change sprite state
	// see example here -> http://pixijs.github.io/examples/index.html?s=demos&f=texture-swap.js&title=Texture%20Swap

	// add "real" items
	for (i = 0; i < realSizeInItems; i += 1) {
		items.push(i);
		//items.push(8);
	}

	items = items.sort(function () {
		return Math.random() - 0.5;
	});

	// add zero hidden item
	// add object the same as last object to start of arr
	items.unshift(items[items.length - 1]);
	//items.unshift(5);

	// add last items, the same as first items
	for (i = 1, len = wheel.hi + 1; i <= len; i += 1) { // i = 1, i <= len !!, it is not a mistake
		items.push(items[i]);
		//items.push(5);
	}

	items = items.map(function (item) {
		return wheel.getNewItem(item);
	});
	items[items.length-1].sprite.alpha = 0.5;

	// magic block - end

	// count needed stage height
	var stageHeightInItems = -2; // reduce	for first and last items
	items.forEach(function (item) {
		stageHeightInItems += item.hi;
	});

	// set sprite positions
	items.forEach(function (item, index) {

		setTimeout(function () {





			var sprite = item.sprite;

			wheel.stage.addChild(sprite);

			if (index) { // do not use zero extra item
				stageHeightInItems -= item.hi;
			}
			sprite.position.y = stageHeightInItems * wheel.itemHeight - (94-70)/2; //TODO: REMOVE HARD CODE







		}, 300 * index);

	});

};

Wheel.prototype.updatePosition = function () {

	return;

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

	this.stage.position.y = this.position * this.itemHeight;

};

Wheel.prototype.beginSpin = function () {

	var wheel = this;

	wheel.position = wheel.position % wheel.size;
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

	if (this.position >= this.size) {

		this.position %= this.size;
	}

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
		size = wheel.size,
		needStopping = wheel.needStopping;

	if (!v) {
		return;
	}

	if (!needStopping) { // wait for position to begin ending

		position += sIncrease;

		wheel.position = position;

		// detect starting of ending
		var deltaPath = (position + wheel.beginPath - wheel.endSpinStopPosition) % size;

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

	wheel.position = position % size;

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