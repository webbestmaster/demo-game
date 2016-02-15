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
		vMax: 6, // 3
		t: 0,
		tIncrease: 0.2, // 0.1
		sIncrease: 0,
		begin: {
			a: 0.4
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
			v: 0,
			beginSpinStartPosition: model.get('position')
		});

		model.updatePosition();

	},

	endSpin: function (position) {

		var model = this;

		//model.set('endPosition', position);

		//var model = this;

		model.set({
			//position: model.get('position') % model.get('wheelItemCount'),
			spinState: 'spin-end',
			t: 0,
			a: -model.get('begin').a,
			//v: 0,
			endSpinStopPosition: position
		});

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

			case 'spin-end':

				model.updateSpinEnd();

				break;

		}

	},

	updateSpinBegin: function () {

		var model = this,
			tIncrease = model.get('tIncrease'),
			t = model.get('t') + tIncrease,
			a = model.get('a'),
			v = a * t,
			vMax = model.get('vMax'),
			beginSpinCb = model.get('beginSpinCb'),
		//position = beginSpinStartPosition + v * t / 2;
			position = model.get('beginSpinStartPosition') + v * t / 2 - Math.sin(v / vMax * Math.PI) * 1.2;

		model.set({
			position: position,
			t: Math.round(t * 100) / 100
		});

		if (v < vMax) {
			return;
		}

		model.set({
			v: v,
			spinState: 'spin-main',
			beginTime: Math.round(t * 100) / 100,
			beginPath: position - model.get('beginSpinStartPosition'),
			sIncrease: v * tIncrease,
			needStopping: false,
			t: 0
		});

		if (beginSpinCb) {
			beginSpinCb();
			model.set('beginSpinCb', null);
		}

	},

	updateSpinMain: function () {

		var model = this,
			position = model.get('position') + model.get('sIncrease');

		model.set('position', position % model.get('wheelItemCount'));

	},

	updateSpinEnd: function () {

		var model = this,
			v = model.get('v'),
			tIncrease = model.get('tIncrease'),
			t = model.get('t'),
			position = model.get('position'),
			sIncrease = model.get('sIncrease'),
			wheelItemCount = model.get('wheelItemCount'),
			needStopping = model.get('needStopping');

		if (!v) {
			return;
		}

		if (!needStopping) { // wait for position to begin ending

			position += sIncrease;

			model.set('position', position);

			// detect starting of ending
			var deltaPath = (position + model.get('beginPath') - model.get('endSpinStopPosition')) % wheelItemCount;

			if (Math.abs(deltaPath) >= sIncrease) {
				return;
			}

			model.set({
				lastPosition: position /*- deltaPath*/,
				needStopping: true,
				deltaPath: deltaPath
			});

			return;

		}

		var a = model.get('a'),
			endSpinCb = model.get('endSpinCb');

		position = model.get('lastPosition') + v * t + a * t * t / 2;
		position += model.get('deltaPath') * ( a * t / v );
		position -= Math.sin((v - a * t) / v * Math.PI) * 1.2;

		model.set('position', position % wheelItemCount); //

		t += tIncrease;

		model.set('t', Math.round(t * 100) / 100);

		if (t <= model.get('beginTime')) {
			return;
		}

		model.set({
			position: model.get('endSpinStopPosition'),
			v: 0,
			t: 0
		});

		if (endSpinCb) {
			endSpinCb();
			model.set('endSpinCb', null);
		}

	}


});


export default WheelModel;