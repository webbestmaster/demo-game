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

		render.appendTo(view.$el.get(0));

		view.render();

		render.preLoadAssets().done(function () {
			wheelCollection.initializeWheels({
				wheelCount: 6
			});
		});


/*
		util.requestAnimationFrame(anim);

		function anim() {

			util.requestAnimationFrame(anim);

			log(Date.now());

		}
*/


		return BaseView.prototype.initialize.apply(view, arguments);

	},

	spin: function () {

		var view = this,
			wheelCollection = view.get('wheelCollection');

		wheelCollection.spin();

	}

});

export default HomeView;