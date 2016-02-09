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

			w = device.get('width'),
			h = device.get('height'),

		// create an new instance of a pixi stage
			stage = new PIXI.Container(),

		// create a renderer instance.
			renderer = PIXI.autoDetectRenderer(w, h, {
				backgroundColor: 0x000000
			});

		render.set({
			w: w,
			h: h,
			stage: stage,
			renderer: renderer
		});

	},

	initWheelMeasure: function () {

		var render = this,
			width = render.get('w'),
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

	drawWheels: function (data) {

		var render = this,
			wheelsData = data.wheels,
			wheelsSprite = render.get('wheels'),
			itemWidth = render.get('itemWidth'),
			itemHeight = render.get('itemHeight');

		wheelsSprite.forEach(function (sprite, index) {
			sprite.position.y = wheelsData[index].position * itemHeight;
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

	appendTo: function (node) {

		var render = this;

		node.appendChild(render.get('renderer').view);

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

		loader = loader.add('itemsSprite', 'i/items-sprite.png');

		loader
			.on('progress', function () {
				log('on loading progress');
			})
			.load(function (loader, resources) {
				log('on loading complete');

				render.set(resources);

				defer.resolve();

			});

		return defer.promise();

	}

};

export default Render;