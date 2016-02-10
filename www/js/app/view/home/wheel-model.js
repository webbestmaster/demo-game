'use strict';
/*global window */
/*global */

import Backbone from './../../../lib/backbone';
import $ from './../../../lib/jbone';
import log from './../../../services/log';

var WheelModel = Backbone.Model.extend({

	defaults: {
		position: 0,
		//a: 0,
		v: 0,
		vMax: 3,
		t: 0,
		tIncrease: 0.1,
		begin: {
			a: 0.5
		},
		wheelItemCount: 12,
		beginSpinCb: null
	},

	initialize: function () {

		log('wheel was initialized!');

		var model = this,
			wheelItemCount = model.get('wheelItemCount');

		model.set('position', Math.floor(wheelItemCount * Math.random()));

	},

	beginSpin: function () {

		var model = this;

		model.set({
			position: model.get('position') % model.get('wheelItemCount'),
			spinState: 'spin-begin',
			t: 0,
			a: model.get('begin').a,
			beginSpinStartPosition: model.get('position')
		});

		model.updatePosition();

	},

	updatePosition: function () {

		var model = this,
			spinState = model.get('spinState');

		switch (spinState) {
			case 'spin-begin':

				model.updateSpinBegin();

				break;

			case 'spin-main':

				model.updateSpinMain();

				break;

		}

	},

	updateSpinBegin: function () {

		var model = this,
			t = model.get('t') + model.get('tIncrease'),
			a = model.get('a'),
			v = a * t,
			vMax = model.get('vMax'),
			beginSpinStartPosition = model.get('beginSpinStartPosition'),
			beginSpinCb = model.get('beginSpinCb'),
			//position = beginSpinStartPosition + v * t / 2;
			position = beginSpinStartPosition  + v * t / 2 - Math.sin( v / vMax * Math.PI) * 1.5;

		if (v > vMax) {

			model.set({
				position: position
			});

			model.set('spinState', 'spin-main');

			if (beginSpinCb) {
				beginSpinCb();
			}

			return;

		}

		model.set({
			t: t,
			position: position
		});

	},

	updateSpinMain: function () {

		var model = this,
			vMax = model.get('vMax'),
			position = model.get('position');

		position = position + vMax * model.get('tIncrease');

		model.set({
			position: position
		});

	}


});


export default WheelModel;