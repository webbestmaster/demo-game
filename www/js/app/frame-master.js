define(['./texture-master'], function (textureMaster) {
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

			frameStage.width *= 2;
			frameStage.height *= 2;

			for (var i = 0; i <= 17; i += 1) {

				frameId = 'frame-part-' + i;

				sprite = new PIXI.Sprite.fromFrame(frameId);

				frameData = frames[frameId].frame;

				sprite.position.x = frameData.x;
				sprite.position.y = frameData.y;

				sprite.scale.x = 0.5;
				sprite.scale.y = 0.5;

				sprite.position.x *= 0.5;
				sprite.position.y *= 0.5;

				frameStage.addChild(sprite);

			}

			// todo: use this case for each sprite

			var baseTexture = frameStage.generateTexture(gameData.renderer, textureMaster.resolution, PIXI.SCALE_MODES.DEFAULT);

			var texture = new PIXI.Texture(baseTexture);

			for (i = frameStage.children.length - 1; i >= 0; i--) {
				frameStage.removeChild(frameStage.children[i]);
			}

			sprite = new PIXI.Sprite(texture);

			sprite.position.x += delta.x;
			sprite.position.y += delta.y;

			frameStage.addChild(sprite);

		}

	};

	return frameMaster;
});