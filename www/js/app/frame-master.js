define(['./texture-master'], function (textureMaster) {
	var frameMaster = {

		original: {
			full: {
				w: 780,
				h: 520
			}
		},

		initSprites: function () {

			var frame = this;
			var frameStage = frame.stage;
			var sprite;
			var data = PIXI.loader.resources['i/game/frame/frame.json'].data;
			var frames = data.frames;
			var frameId;
			var frameData;
			var delta = data.meta.delta;
			var resolution = textureMaster.resolution;

			for (var i = 0; i <= 17; i += 1) {

				frameId = 'frame-part-' + i;

				frameData = frames[frameId].frame;

				sprite = new PIXI.Sprite.fromFrame(frameId);

				sprite.scale.x = 1 / resolution;
				sprite.scale.y = 1 / resolution;

				sprite.position.x = Math.round( (frameData.x + delta.x) / resolution);
				sprite.position.y = Math.round( (frameData.y + delta.y) / resolution);

				frameStage.addChild(sprite);

			}

		}

	};

	return frameMaster;
});