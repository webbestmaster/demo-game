define (['./../lib/util'], function (util) {
	var frameMaster = {

		original: {
			full: {
				w: 780,
				h: 520
			}
		},

		/*
		 update: function () {

		 var frame = this;

		 if (frame.logoFrame) {
		 frame.updateAnimateLogo();
		 }

		 },
		 */

		initSprites: function () {

			var frame = this;
			var frameStage = frame.stage;
			var sprite;
			var data = PIXI.loader.resources['i/game/frame/frame.json'].data;
			var frames = data.frames;
			var frameId;
			var frameData;
			var delta = data.meta.delta;

			for (var i = 0; i <= 16; i += 1) {

				frameId = 'frame-part-' + i;

				sprite = new PIXI.Sprite.fromFrame(frameId);

				frameData = frames[frameId].frame;

				sprite.position.x = frameData.x + delta.x;
				sprite.position.y = frameData.y + delta.y;

				frameStage.addChild(sprite);

			}

		}

		// todo: remove this code -> create normal animator object and logic
//	logoFrame: 100,

		/*
		 updateAnimateLogo: function () {

		 var frame = this;

		 /!*
		 var filter = new PIXI.filters.PixelateFilter();

		 filter.size = new PIXI.Point(frame.logoFrame / 5, frame.logoFrame / 5);

		 logoSprite.filters = [filter];
		 *!/

		 frame.logoFrame -= 1;

		 if (frame.logoFrame <= 0) {
		 logoSprite.filters = null;
		 }

		 }
		 */

	};

	return frameMaster;
});