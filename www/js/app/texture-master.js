define(['./../lib/deferred', './../lib/util', './../services/log'], function (Deferred, util, log) {

	var textureMaster = {

		resolution: 1,

		baseUrl: '',

		initTextures: function () {

			var master = this;

			var defer = new Deferred();

			var loader = PIXI.loader;

			loader.baseUrl = master.baseUrl;

			loader.add('i/game/effect/club-win-animation.json');
			loader.add('i/game/effect/respin-pop-up.json');
			loader.add('i/game/game/wheel.json');
			loader.add('i/game/game/symbols-normal.json');
			loader.add('i/game/game/symbols-blur.json');
			loader.add('i/game/frame/frame.json');

			loader
				.on('progress', function () {
					log('on loading texture progress');
				})
				.load(function (loader, resources) {
					defer.resolve();
				});

			return defer.promise();

		},

		init: function () {

			var master = this;
			var resolution = master.getDevicePixelRatio();

			master.resolution = resolution;

			if (resolution !== 1) {
				master.baseUrl = 'i-2'
			}

		},

		getDevicePixelRatio: function () {

			var resolution = Math.floor(window.devicePixelRatio || 1);

			if (resolution >= 2) {
				resolution = 2;
			}

			return resolution;

		}

	};

	textureMaster.init();

	return textureMaster;

});