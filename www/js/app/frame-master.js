define(function () {
	var frameMaster = {

		original: {
			full: {
				w: 780,
				h: 520
			}
		},

		initSprites: function (gameData) {

			var frame = this;
			var frameStage = frame.stage;
			var sprite;
			var data = PIXI.loader.resources['i/game/frame/frame.json'].data;
			var frames = data.frames;
			var frameId;
			var frameData;
			var delta = data.meta.delta;

			for (var i = 0; i <= 17; i += 1) {

				frameId = 'frame-part-' + i;

				frameData = frames[frameId].frame;

				sprite = new PIXI.Sprite.fromFrame(frameId);

				sprite.scale.x = 0.5;
				sprite.scale.y = 0.5;

				sprite.position.x = Math.round( (frameData.x + delta.x) / 2);
				sprite.position.y = Math.round( (frameData.y + delta.y) / 2);

				frameStage.addChild(sprite);

			}

		}

	};

	return frameMaster;
});