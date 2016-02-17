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

		if (frame.logoFrame) {
			frame.updateAnimateLogo();
		}

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

	updateAnimateLogo: function () {

		var frame = this;

		var logoSprite = frameTextures.textures.logo.sprite;

/*
		var filter = new PIXI.filters.PixelateFilter();

		filter.size = new PIXI.Point(frame.logoFrame / 5, frame.logoFrame / 5);

		logoSprite.filters = [filter];
*/

		frame.logoFrame -= 1;

		if (frame.logoFrame <= 0) {
			logoSprite.filters = null;
		}

	}

};

export default frameMaster;