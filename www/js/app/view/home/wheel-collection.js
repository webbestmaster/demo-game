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

	},

	initializeWheels: function (data) {

		var collection = this,
			i,
			len = data.wheelCount;

		for (i = 0; i < len; i += 1) {
			collection.initializeWheel({
				position: i
			});
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

	initializeWheel: function (data) {

		var collection = this;

		collection.add(data);

	},

	spin: function () {

		var collection = this;

		collection.beginSpin();

	},

	beginSpin: function () {

		var collection = this;

		collection.each(function (wheel, index) {

			setTimeout(function () {
				wheel.beginSpin().done(function () {

					console.log('begin animation end')

				});
			}, 300 * index);

		});

		function anim() {

			requestAnimationFrame(anim);

			collection.each(function (wheel) {
				wheel.updatePosition();
			});

			collection.drawWheels();

		}

		requestAnimationFrame(anim);

	}


});

export default WheelCollection;