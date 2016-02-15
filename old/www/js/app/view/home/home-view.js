'use strict';
/*global window */

import BaseView from './../core/base';
import tm from './../../../services/template-master';
import util from './../../../services/util';
import device from './../../../services/device';
import log from './../../../services/log';
import $ from './../../../lib/jbone';
import WheelCollection from './wheel-collection';
import Render from './render';

var HomeView = BaseView.extend({

	events: {
		//scroll: 'stopEvent',
		'click .js-spin': 'spin'
	},

	initialize: function () {

		var view = this,
			wheelCollection = new WheelCollection(),
			render = new Render(),
			wheelCanvasNode, wheelCanvasWidth, wheelCanvasHeight, wheelCanvasAspect;

		view.set('wheelCollection', wheelCollection);
		//view.set('render', render);

		view.setElement(tm.get('home')());

		view.set('$spinButton', view.$el.find('.js-spin'));

		render.appendTo(view.$el.find('.js-wheel-canvas-frame').get(0));

		wheelCanvasNode = render.get('renderer').view;
		wheelCanvasWidth = parseInt(wheelCanvasNode.getAttribute('width'), 10);
		wheelCanvasHeight = parseInt(wheelCanvasNode.getAttribute('height'), 10);
		wheelCanvasAspect = wheelCanvasWidth / wheelCanvasHeight;

		view.set('wheelCanvas', {
			$node: $(wheelCanvasNode),
			node: wheelCanvasNode,
			width: wheelCanvasWidth,
			height: wheelCanvasHeight,
			aspect: wheelCanvasAspect
		});

		view.set('$frame', view.$el.find('.js-wheel-canvas-frame'));

		view.setNodeSizes();

		view.render();

		render.preLoadAssets().done(function () {
			wheelCollection.initializeWheels({
				wheelCount: 6
			});
			view.$el.find('.js-game-logo').addClass('game-logo_shown');
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
		view.subscribe('resize', view.setNodeSizes);

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

	},

	setNodeSizes: function () {

		var view = this,
			wheelCanvasData = view.get('wheelCanvas'),
			$frame = view.get('$frame'),
			$wheelCanvas = wheelCanvasData.$node,
			wheelCanvasAspect = wheelCanvasData.aspect,
			//canvasOriginalWidth = wheelCanvasData.width,
			//canvasOriginalHeight = wheelCanvasData.height,
			screenWidth = device.get('width'),
			screenWidth75 = screenWidth * 0.75,
			//screenWidth50 = screenWidth * 0.50,
			//screenWidth25 = screenWidth * 0.25,
			screenWidth12_5 = screenWidth * 0.125;

		$wheelCanvas.css({
			width: screenWidth75 + 'px',
			height: screenWidth75 / wheelCanvasAspect + 4 + 'px',
			marginTop: (screenWidth / 2200 * 1407 - screenWidth75 / wheelCanvasAspect + 4) / 2 - 3 + 'px'
		});

		$frame.css({
			width: screenWidth + 'px',
			height: screenWidth / 2200 * 1407 + 'px' // use frame aspect ratio
		});

	}

});

export default HomeView;