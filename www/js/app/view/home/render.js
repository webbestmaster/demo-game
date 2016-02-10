'use strict';
/*global window */
/*global */

import log from './../../../services/log';
import util from './../../../services/util';
import device from './../../../services/device';
import mediator from './../../../services/mediator';
import $ from './../../../lib/jbone';

function Render() {

	var render = this;

	mediator.installTo(render);

	render.attr = {
		originalItemWidth: 354,
		originalItemHeight: 194,
		wheelCount: 6,
		minWheelVisibleHeight: 3,
		maxWheelVisibleHeight: 7,
		wheels: []
	};

	render.initialize();

	render.initWheelMeasure();

	render.bindEventListeners();

	//render.preLoadAssets();

}

Render.prototype = {

	/*
	 images: [
	 'item-bonus',
	 'item-elli',
	 'item-lame',
	 'item-lion',
	 'item-metal-man',
	 'item-wild',
	 'item-wild-small-1',
	 'item-wild-small-2'
	 ],
	 */

	set: function (keyOrObj, value) {

		var self = this,
			attr = self.attr;

		if (typeof keyOrObj === 'string') {
			attr[keyOrObj] = value;
			return self;
		}

		Object.keys(keyOrObj).forEach(function (key) {
			this[key] = keyOrObj[key];
		}, attr);

		return self;

	},
	get: function (key) {

		return this.attr[key];

	},

	empty: function () {

		this.attr = {};

		return this;

	},

	initialize: function () {

		var render = this,

			canvasSize = render.detectCanvasSize(),

			width = canvasSize.width,
			height = canvasSize.height,

		// create an new instance of a pixi stage
			stage = new PIXI.Container(),

		// create a renderer instance.
			renderer;

		/*
		 if (width < height) {
		 height = [width, width = height][0]; // trust me - I'm engineer
		 }
		 */
		renderer = PIXI.autoDetectRenderer(width, height, {
			transparent: false
			//resolution: 2
		});

		log('isWebGL - ' + (renderer instanceof PIXI.WebGLRenderer));

		render.set({
			width: width,
			height: height,
			stage: stage,
			renderer: renderer
		});

	},

	detectCanvasSize: function () {

		var render = this,
			width = Math.max(device.get('width'), device.get('height')),
			wheelCount = render.get('wheelCount'),
			originalItemWidth = render.get('originalItemWidth'),
			originalItemHeight = render.get('originalItemHeight'),
			maxWheelVisibleHeight = render.get('maxWheelVisibleHeight'),
			height;

		height = Math.floor(originalItemHeight * maxWheelVisibleHeight * width / (originalItemWidth * wheelCount));

		return {
			width: width,
			height: height
		};

	},

	initWheelMeasure: function () {

		var render = this,
			width = render.get('width'),
			itemWidth = width / render.get('wheelCount'),
			itemScale = itemWidth / render.get('originalItemWidth'),
			itemHeight = render.get('originalItemHeight') * itemScale;

		render.set({
			itemWidth: itemWidth,
			itemHeight: itemHeight,
			itemScale: itemScale
		});

	},

	bindEventListeners: function () {

		var render = this;

		render.subscribe('render:increase-wheel', render.increaseWheel);
		render.subscribe('render:draw-wheels', render.drawWheels);

	},

	drawWheels: function (wheelsData) {

		var render = this,
			wheelsSprite = render.get('wheels'),
			itemWidth = render.get('itemWidth'),
			itemHeight = render.get('itemHeight');

		wheelsSprite.forEach(function (sprite, index) {
			sprite.tilePosition.y = wheelsData[index] * itemHeight;
		});

		render.rerender();

	},

	rerender: function () {

		var render = this,
			renderer = render.get('renderer'),
			stage = render.get('stage');

		renderer.render(stage);

	},

	increaseWheel: function () {

		var render, itemScale, texture, wheel, wheelLength, stage, wheels, wheelVisibleItemSize, minWheelVisibleHeight, maxWheelVisibleHeight, itemHeight;

		render = this;
		wheels = render.get('wheels');

		itemHeight = render.get('itemHeight');

		itemScale = render.get('itemScale');
		texture = render.get('itemsSprite').texture;

		wheelLength = wheels.length;

		minWheelVisibleHeight = render.get('minWheelVisibleHeight');
		maxWheelVisibleHeight = render.get('maxWheelVisibleHeight');

		wheelVisibleItemSize = wheelLength + minWheelVisibleHeight;

		wheelVisibleItemSize = util.getBetween(minWheelVisibleHeight, wheelVisibleItemSize, maxWheelVisibleHeight);

		wheel = new PIXI.extras.TilingSprite(texture, render.get('itemWidth'), wheelVisibleItemSize * itemHeight);
		stage = render.get('stage');

		wheel.position = {
			x: wheelLength * render.get('itemWidth'),
			y: itemHeight * (maxWheelVisibleHeight - wheelVisibleItemSize) / 2
		};

		wheels.push(wheel);

		stage.addChild(wheel);

	},

	/*
	 increaseWheel: function () {

	 var render = this,
	 itemScale = render.get('itemScale'),
	 texture = render.get('itemsSprite').texture,
	 wheel = new PIXI.Sprite(texture),
	 stage = render.get('stage'),
	 wheels = render.get('wheels');

	 wheel.scale = {
	 x: itemScale,
	 y: itemScale
	 };

	 wheel.anchor.y = 0.5;

	 wheel.position.x = wheels.length * render.get('itemWidth');

	 wheels.push(wheel);

	 stage.addChild(wheel);

	 },

	 */
	appendTo: function (node) {

		var render = this,
			view = render.get('renderer').view;

		view.className = 'wheel-canvas';

		node.appendChild(view);

	},

	preLoadAssets: function () {

		var render = this,
			loader = PIXI.loader,
			defer = $.Deferred();

		/*
		 render.images.forEach(function (item) {
		 loader = loader.add(item, 'i/item/' + item + '.png');
		 });
		 */

		render.resizeImage('i/items-sprite.png').done(function (base64) {

			loader = loader.add('itemsSprite', base64);

			loader
				.on('progress', function () {
					log('on loading progress');
				})
				.load(function (loader, resources) {
					log('on loading complete');

					render.set(resources);

					defer.resolve();

				});
		});


		return defer.promise();

	},

	resizeImage: function (pathToImage) {

		var render = this,
			newWidth = render.get('itemWidth'),
			defer = $.Deferred(),
			img = new Image();

		img.onload = function () {

			var canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d');

			canvas.width = newWidth;
			canvas.height = newWidth * (img.height / img.width);

			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			img.onload = null;

			defer.resolve(canvas.toDataURL());

		};

		img.src = pathToImage;

		return defer.promise();

	}

};

export default Render;