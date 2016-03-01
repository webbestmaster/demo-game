define(['./../lib/deferred', './effect-textures', './../lib/util', './../services/log'], function (Deferred, effectTextures, util, log) {

	var textureMaster = {

		resolution: 1,

		initTextures: function () {

			var defer = new Deferred();

			var loader = PIXI.loader;

			//loader.baseUrl = 'hi/';

			//var gameTexturesData = gameTextures.textures;
			var effectTexturesData = effectTextures.textures;

			/*
			 util.eachHash(gameTexturesData, function (item, key) {
			 loader.add('gameTextures/' + key, item.path);
			 });
			 */

			util.eachHash(effectTexturesData, function (item, key) {
				loader.add('effectTextures/' + key, item.path);
			});

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

					util.eachHash(resources, function (value, key) {

						var path = key.split('/'),
							root = path[0],
							name = path[1];

						switch (root) {

							/*
							 case 'gameTextures':
							 gameTexturesData[name].texture = value;
							 break;
							 */

							case 'effectTextures':
								effectTexturesData[name].texture = value;
								break;

						}

					});

					defer.resolve();

				});

			return defer.promise();

		},

		init: function () {

			this.resolution = this.getDevicePixelRatio();

		},

		getDevicePixelRatio: function () {
			return window.devicePixelRatio || 1;
		}

	};

	textureMaster.init();

	return textureMaster;

});