define (function () {
	var util = {

		eachHash: function (hash, fn) {

			var key;

			for (key in hash) {
				if (hash.hasOwnProperty(key)) {
					fn(hash[key], key);
				}
			}

		}

	};

	return util;
});



/*jslint white: true, nomen: true */
(function (win) {

	'use strict';
	/*global window */
	/*global */


	var tt = {
		"item-wild-x3_blur.png":
		{
			"frame": {"x":600,"y":1,"w":597,"h":1094},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":178,"y":222,"w":597,"h":1094},
			"sourceSize": {"w":597,"h":1094}
		},
		"item-bonus-x3_blur.png":
		{
			"frame": {"x":1,"y":1,"w":597,"h":1115},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":183,"y":207,"w":597,"h":1115},
			"sourceSize": {"w":597,"h":1115}
		},
		"item-wild-violet_blur.png":
		{
			"frame": {"x":601,"y":1097,"w":597,"h":471},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":177,"y":545,"w":597,"h":471},
			"sourceSize": {"w":597,"h":471}
		},
		"item-wild-green_blur.png":
		{
			"frame": {"x":1754,"y":1,"w":597,"h":469},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":177,"y":545,"w":597,"h":469},
			"sourceSize": {"w":597,"h":469}
		},
		"item-girl_blur.png":
		{
			"frame": {"x":1799,"y":1047,"w":598,"h":467},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":179,"y":528,"w":597,"h":467},
			"sourceSize": {"w":597,"h":467}
		},
		"item-lion_blur.png":
		{
			"frame": {"x":1200,"y":1443,"w":597,"h":468},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":180,"y":527,"w":597,"h":468},
			"sourceSize": {"w":597,"h":468}
		},
		"item-woodcutter_blur.png":
		{
			"frame": {"x":1,"y":1118,"w":598,"h":515},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":179,"y":481,"w":597,"h":515},
			"sourceSize": {"w":597,"h":515}
		},
		"item-scarecrow_blur.png":
		{
			"frame": {"x":1199,"y":556,"w":597,"h":469},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":180,"y":528,"w":597,"h":469},
			"sourceSize": {"w":597,"h":469}
		},
		"item-dog_blur.png":
		{
			"frame": {"x":1799,"y":1516,"w":597,"h":428},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":181,"y":574,"w":597,"h":428},
			"sourceSize": {"w":597,"h":428}
		},
		"item-poppy_blur.png":
		{
			"frame": {"x":602,"y":1570,"w":596,"h":401},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":181,"y":605,"w":596,"h":401},
			"sourceSize": {"w":596,"h":401}
		},
		"item-crow_blur.png":
		{
			"frame": {"x":1200,"y":1027,"w":595,"h":414},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":178,"y":587,"w":595,"h":414},
			"sourceSize": {"w":597,"h":414}
		},
		"item-diamond_blur.png":
		{
			"frame": {"x":2353,"y":1,"w":282,"h":338},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {"x":0,"y":0,"w":597,"h":338},
			"sourceSize": {"w":597,"h":338}
		},
		"item-club_blur.png":
		{
			"frame": {"x":1,"y":1635,"w":300,"h":335},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {"x":0,"y":0,"w":300,"h":335},
			"sourceSize": {"w":597,"h":335}
		},
		"item-spades_blur.png":
		{
			"frame": {"x":303,"y":1635,"w":297,"h":331},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {"x":0,"y":0,"w":297,"h":331},
			"sourceSize": {"w":597,"h":331}
		},
		"item-heart_blur.png":
		{
			"frame": {"x":2308,"y":472,"w":302,"h":286},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {"x":0,"y":0,"w":302,"h":286},
			"sourceSize": {"w":597,"h":286}
		},
		"item-q_blur.png":
		{
			"frame": {"x":1798,"y":472,"w":508,"h":573},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {"x":0,"y":0,"w":508,"h":573},
			"sourceSize": {"w":597,"h":573}
		},
		"item-ring_blur.png":
		{
			"frame": {"x":1199,"y":1,"w":553,"h":553},
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": {"x":0,"y":0,"w":553,"h":553},
			"sourceSize": {"w":597,"h":553}
		}
	};

	var q = 0.25;

	for (var key in tt) {
		if (tt.hasOwnProperty(key)) {

			var frame = tt[key].frame;
			var spriteSourceSize = tt[key].spriteSourceSize;
			var sourceSize = tt[key].sourceSize;

			frame.x = Math.floor(frame.x * q);
			frame.y = Math.floor(frame.y * q);
			frame.w = Math.floor(frame.w * q);
			frame.h = Math.floor(frame.h * q);

			spriteSourceSize.x = Math.floor(spriteSourceSize.x * q);
			spriteSourceSize.y = Math.floor(spriteSourceSize.y * q);
			spriteSourceSize.w = Math.floor(spriteSourceSize.w * q);
			spriteSourceSize.h = Math.floor(spriteSourceSize.h * q);

			sourceSize.w = Math.floor(sourceSize.w * q);
			sourceSize.h = Math.floor(sourceSize.h * q);

		}

	}


	console.log(JSON.stringify(tt));


}(window));


/*
window.util = util;


util.createClubJSON = function () {

	var x,
		y,
		maxX = 8,
		maxY = 14,
		jsonObj = {
			frames: {}
		},
		index = 0,
		frameWidth = 125,
		frameHeight = 70,
		frameNamePrefix = 'club-',
		frameNamePostfix = '';

	for (y = 0; y < maxY; y += 1) {
		for (x = 0; x < maxX; x += 1) {
			if (index === 105) {
				continue;
			}
			jsonObj.frames[frameNamePrefix + index + frameNamePostfix] = {
				frame: {
					x: x * frameWidth,
					y: y * frameHeight,
					w: frameWidth,
					h: frameHeight
				},
				rotated: false,
				sourceSize: {
					w: frameWidth,
					h: frameHeight
				}
			};

			index += 1;
		}
	}

	console.log(JSON.stringify(jsonObj.frames));

};

util.createRespinPupUpJSON = function () {

	var x,
		y,
		maxX = 8,
		maxY = 11,
		jsonObj = {
			frames: {}
		},
		index = 0,
		frameWidth = 466,
		frameHeight = 302,
		frameNamePrefix = 'respin-pop-up-';

	for (y = 0; y < maxY; y += 1) {
		for (x = 0; x < maxX; x += 1) {
			if (index === 81) {
				continue;
			}
			jsonObj.frames[frameNamePrefix + index] = {
				frame: {
					x: x * frameWidth,
					y: y * frameHeight,
					w: frameWidth,
					h: frameHeight
				},
				rotated: false,
				sourceSize: {
					w: frameWidth,
					h: frameHeight
				}
			};

			index += 1;
		}
	}

	console.log(JSON.stringify(jsonObj.frames));

};
*/
