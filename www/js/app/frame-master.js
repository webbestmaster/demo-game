import util from './../lib/util';
import frameTextures from './frame-textures';

var frameMaster = {

	original: {
		full: {
			w: 780,
			h: 520
		}
	},

	update: function () {

		var frame = this;

		frame.updateAnimateLogo();

	},

	initSprites: function () {

		var frame = this;
		var frameStage = frame.stage;

		util.eachHash(frameTextures.textures, function (spriteData) {

			var sprite = new PIXI.Sprite(spriteData.texture.texture);

			spriteData.sprite = sprite;

			sprite.position.x = spriteData.x;
			sprite.position.y = spriteData.y;
			sprite.width = spriteData.w;
			sprite.height = spriteData.h;

			frameStage.addChild(sprite);

		});

		frame.logoZeroPosition = {
			x: frameTextures.textures.logo.sprite.position.x,
			y: frameTextures.textures.logo.sprite.position.y
		}

	},

	// todo: remove this code -> create normal animator object and logic
	logoFrame: 100,
	logoCount: 0,

	updateAnimateLogo: function () {

		var frame = this;

		frame.logoCount = frame.logoCount + 0.001;

		var logoSprite = frameTextures.textures.logo.sprite;

		if (frame.logoFrame) {

			var filter = new PIXI.filters.PixelateFilter();

			filter.size = new PIXI.Point(frame.logoFrame / 5, frame.logoFrame / 5);

			logoSprite.filters = [filter];

			frame.logoFrame -= 1;

			if (frame.logoFrame <= 0) {
				logoSprite.filters = null;
			}

		}

		logoSprite.position.x = frame.logoZeroPosition.x + Math.sin(frame.logoCount) * 10;

	}

};

export default frameMaster;