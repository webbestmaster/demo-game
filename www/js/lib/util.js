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

		"frame-part-0": {
		"frame": { "x": 14, "y": 0, "w": 123, "h": 155 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 123, "h": 155 },
		"sourceSize": { "w": 123, "h": 155 }
	},

		"frame-part-1": {
		"frame": { "x": 227, "y": 73, "w": 33, "h": 45 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 33, "h": 45 },
		"sourceSize": { "w": 33, "h": 45 }
	},

		"frame-part-2": {
		"frame": { "x": 260, "y": 47, "w": 125, "h": 33 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 125, "h": 33 },
		"sourceSize": { "w": 125, "h": 33 }
	},

		"frame-part-3": {
		"frame": { "x": 377, "y": 39, "w": 94, "h": 8 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 94, "h": 8 },
		"sourceSize": { "w": 94, "h": 8 }
	},

		"frame-part-4": {
		"frame": { "x": 471, "y": 5, "w": 40, "h": 43 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 40, "h": 43 },
		"sourceSize": { "w": 40, "h": 43 }
	},

		"frame-part-5": {
		"frame": { "x": 511, "y": 0, "w": 256, "h": 15 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 15 },
		"sourceSize": { "w": 256, "h": 15 }
	},

		"frame-part-6": {
		"frame": { "x": 754, "y": 15, "w": 12, "h": 491 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 12, "h": 491 },
		"sourceSize": { "w": 12, "h": 491 }
	},

		"frame-part-7": {
		"frame": { "x": 503, "y": 495, "w": 251, "h": 11 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 251, "h": 11 },
		"sourceSize": { "w": 251, "h": 11 }
	},

		"frame-part-8": {
		"frame": { "x": 473, "y": 461, "w": 38, "h": 34 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 38, "h": 34 },
		"sourceSize": { "w": 38, "h": 34 }
	},

		"frame-part-9": {
		"frame": { "x": 377, "y": 461, "w": 96, "h": 9 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 96, "h": 9 },
		"sourceSize": { "w": 96, "h": 9 }
	},

		"frame-part-10": {
		"frame": { "x": 347, "y": 427, "w": 38, "h": 34 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 38, "h": 34 },
		"sourceSize": { "w": 38, "h": 34 }
	},

		"frame-part-11": {
		"frame": { "x": 251, "y": 427, "w": 96, "h": 9 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 96, "h": 9 },
		"sourceSize": { "w": 96, "h": 9 }
	},

		"frame-part-12": {
		"frame": { "x": 228, "y": 393, "w": 32, "h": 34 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 34 },
		"sourceSize": { "w": 32, "h": 34 }
	},

		"frame-part-13": {
		"frame": { "x": 126, "y": 393, "w": 102, "h": 9 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 102, "h": 9 },
		"sourceSize": { "w": 102, "h": 9 }
	},

		"frame-part-14": {
		"frame": { "x": 107, "y": 357, "w": 28, "h": 36 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 28, "h": 36 },
		"sourceSize": { "w": 28, "h": 36 }
	},

		"frame-part-15": {
		"frame": { "x": 14, "y": 354, "w": 93, "h": 12 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 92, "h": 12 },
		"sourceSize": { "w": 92, "h": 12 }
	},

		"frame-part-16": {
		"frame": { "x": 0, "y": 138, "w": 14, "h": 228 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 14, "h": 228 },
		"sourceSize": { "w": 14, "h": 228 }
	},

		"frame-part-17": {
		"frame": { "x": 137, "y": 0, "w": 90, "h": 118 },
		"rotated": false, "trimmed": false,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 90, "h": 118 },
		"sourceSize": { "w": 90, "h": 118 }
	}

	};


	for (var key in tt) {
		if (tt.hasOwnProperty(key)) {

			var frame = tt[key].frame;
			var spriteSourceSize = tt[key].spriteSourceSize;
			var sourceSize = tt[key].sourceSize;

			frame.x *= 2;
			frame.y *= 2;
			frame.w *= 2;
			frame.h *= 2;

			spriteSourceSize.x *= 2;
			spriteSourceSize.y *= 2;
			spriteSourceSize.w *= 2;
			spriteSourceSize.h *= 2;

			sourceSize.w *= 2;
			sourceSize.h *= 2;

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
