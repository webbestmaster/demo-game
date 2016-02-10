'use strict';
/*global window */
/*global */

import Backbone from './../../../lib/backbone';
import mediator from './../../../services/mediator';
import log from './../../../services/log';
import WheelModel from './wheel-model';

var WheelCollection = Backbone.Collection.extend({

	model: WheelModel,

	//attr: {}, // will added to instance from initialize -> initDataStore

	setData: function (keyOrObj, value) {

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

	getData: function (key) {

		return this.attr[key];

	},

	setSpinState: function (state) {

		return this.attr.spinState = state;

	},

	getSpinState: function () {

		return this.attr.spinState;

	},


	emptyData: function () {

		this.attr = {};

		return this;

	},

	initDataStore: function () {

		this.attr = {};

	},

	initialize: function () {

		var wheelCollection = this;

		mediator.installTo(wheelCollection);

		wheelCollection.initDataStore();

		wheelCollection.setSpinState('ready');

		wheelCollection.animateWheels = wheelCollection.animateWheels.bind(wheelCollection);

	},

	initializeWheels: function (data) {

		var collection = this,
			i,
			len = data.wheelCount;

		for (i = 0; i < len; i += 1) {
			collection.initializeWheel();
			collection.publish('render:increase-wheel');
		}

		collection.drawWheels();

	},

	drawWheels: function () {

		var collection = this;

		//collection.publish('render:draw-wheels', collection.getWheelPositions());
		collection.publish('render:draw-wheels', collection);

	},

/*
	getWheelPositions: function () {

		return this.map(function (wheel) {
			return wheel.get('position');
		});

	},
*/

	initializeWheel: function () {

		var collection = this;

		collection.add({});

	},

	spin: function () {

		var collection = this,
			spinState = collection.getSpinState();

		switch (spinState) {

			case 'ready':

				collection.setSpinState('spin-begin');

				collection.startAnimateWheels();

				collection.beginSpin();

				break;

			case 'spin':

				collection.setSpinState('spin-end');

				//collection.endSpin();

				break;


		}


	},

	beginSpin: function () {

		var collection = this;

		collection.each(function (wheel, index) {
			setTimeout(function () {
				wheel.beginSpin();
			}, 300 * index);
		});

		collection.last().set('beginSpinCb', function () {
			collection.setSpinState('spin');
			console.log('spiiiin');
		});

	},

	startAnimateWheels: function () {

		var collection = this;

		collection.setData('isAnimate', true);

		collection.animateWheels();

	},

	animateWheels: function () {

		if (this.getData('isAnimate')) {

			requestAnimationFrame(this.animateWheels);

			this.each(this.updateWheelPosition);

			this.drawWheels();

		}

	},

	stopAnimateWheels: function () {

		var collection = this;

		collection.setData('isAnimate', false);

	},

	updateWheelPosition: function (wheel) {
		wheel.updatePosition();
	}

});

export default WheelCollection;