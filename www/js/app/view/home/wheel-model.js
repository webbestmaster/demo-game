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
			a: 0.1
		},
		beginSpinDefer: null
	},

	initialize: function () {

		log('wheel was initialized!');

	},

	beginSpin: function () {

		var model = this,
			defer = $.Deferred();

		model.set({
			spinState: 'spin-begin',
			beginSpinDefer: defer,
			t: 0,
			a: model.get('begin').a,
			beginSpinStartPosition: model.get('position')
		});

		model.updatePosition();

		return defer.promise();

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
			position = beginSpinStartPosition + v * t / 2;

		if (v > vMax) {

			model.set({
				position: position
			});

			model.set('spinState', 'spin-main');

			model.get('beginSpinDefer').resolve();

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