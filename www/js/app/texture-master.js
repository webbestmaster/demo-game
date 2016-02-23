define(['./../lib/deferred', './effect-textures', './../lib/util', './../services/log'], function (Deferred, effectTextures, util, log) {

	var textureMaster = {

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
			//loader.add('i/game/effect/respin-pop-up.json');
			loader.add('i/game/game/items.json');
			loader.add('i/game/game/bg-wheels.json');
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

		}

	};


	return textureMaster;
});