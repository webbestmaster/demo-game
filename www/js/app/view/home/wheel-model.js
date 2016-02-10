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
		tIncrease: 0.02, // 0.1
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
			t = model.get('t') + model.get('tIncrease'),
			a = model.get('a'),
			v = a * t,
			vMax = model.get('vMax'),
			beginSpinCb = model.get('beginSpinCb'),
			//position = beginSpinStartPosition + v * t / 2;
			position = model.get('beginSpinStartPosition') + v * t / 2 - Math.sin( v / vMax * Math.PI) * 1.2;

		model.set('position', position);

		if (v > vMax) {

			model.set({
				v: v,
				spinState: 'spin-main',
				beginTime: t,
				beginPath: position - model.get('beginSpinStartPosition')
			});

			//console.log(model.get('beginPath'));

			if (beginSpinCb) {
				beginSpinCb();
				model.set('beginSpinCb', null);
			}

			return;

		}

		model.set('t', t);

	},

	updateSpinMain: function () {

		var model = this,
			v = model.get('v'),
			position = model.get('position');

		position = position + v * model.get('tIncrease');

		model.set('position', position);

	},

	updateSpinEnd: function () {

		// detect
		var model = this,
			v = model.get('v'),
			tIncrease = model.get('tIncrease'),
			t = model.get('t'),
			position;

		if (!v) {
			return;
		}

		position = model.get('position');

		if ( Math.abs( ( position + 11.32 ) % 12 - model.get('endSpinStopPosition') ) > v * tIncrease && t === 0) { // wait for position to begin ending

			position = position + v * tIncrease;

			model.set('position', position);

			model.set('lastPosition', position);

			return;

		}

		var a = model.get('a'),
			endSpinCb = model.get('endSpinCb');

		position = model.get('lastPosition') + v * t + a * t * t / 2 + Math.sin(Math.PI - (v + a * t) / model.get('vMax') * Math.PI) * 1.2;

		t += tIncrease;

		model.set('t', t);

		model.set('position', position);

		if (t === model.get('beginTime')) {

			model.set({
				position: model.get('endSpinStopPosition'),
				v: 0
			});

			if (endSpinCb) {
				endSpinCb();
				model.set('endSpinCb', null);
			}

			return;
		}



	}


});


export default WheelModel;