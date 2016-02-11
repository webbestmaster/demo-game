'use strict';
/*global window */

import BaseView from './../core/base';
import tm from './../../../services/template-master';
import util from './../../../services/util';
import log from './../../../services/log';
import WheelCollection from './wheel-collection';
import Render from './render';

var HomeView = BaseView.extend({

	events: {
		scroll: 'stopEvent',
		'click .js-spin': 'spin'
	},

	initialize: function () {

		var view = this,
			wheelCollection = new WheelCollection(),
			render = new Render();

		view.set('wheelCollection', wheelCollection);
		//view.set('render', render);

		view.setElement(tm.get('home')());

		view.set('$spinButton', view.$el.find('.js-spin'));

		render.appendTo(view.$el.get(0));

		view.render();

		render.preLoadAssets().done(function () {
			wheelCollection.initializeWheels({
				wheelCount: 6
			});
		});

		view.bindEventListeners();

/*
		util.requestAnimationFrame(anim);

		function anim() {

			util.requestAnimationFrame(anim);

			log(Date.now());

		}
*/


		return BaseView.prototype.initialize.apply(view, arguments);

	},

	bindEventListeners: function () {

		var view = this;

		view.subscribe('view:setSpinButtonState', view.setSpinButtonState);

	},

	setSpinButtonState: function (state) {

		var view = this,
			$spinButton = view.get('$spinButton');

		if (state === 'ready') {
			$spinButton.addClass('spin-btn_ready');
		} else {
			$spinButton.removeClass('spin-btn_ready');
		}

	},

	spin: function () {

		var view = this,
			wheelCollection = view.get('wheelCollection');

		wheelCollection.spin();

	}

});

export default HomeView;