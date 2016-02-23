define (function () {
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

			for (var i = 0; i <= 17; i += 1) {

				frameId = 'frame-part-' + i;

				sprite = new PIXI.Sprite.fromFrame(frameId);

				frameData = frames[frameId].frame;

				sprite.position.x = frameData.x + delta.x;
				sprite.position.y = frameData.y + delta.y;

				frameStage.addChild(sprite);

			}

		}

	};

	return frameMaster;
});