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
			"frame": {
				"x": 28,
				"y": 0,
				"w": 246,
				"h": 310
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 246,
				"h": 310
			},
			"sourceSize": {
				"w": 246,
				"h": 310
			}
		},
		"frame-part-1": {
			"frame": {
				"x": 454,
				"y": 146,
				"w": 66,
				"h": 90
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 66,
				"h": 90
			},
			"sourceSize": {
				"w": 66,
				"h": 90
			}
		},
		"frame-part-2": {
			"frame": {
				"x": 520,
				"y": 94,
				"w": 250,
				"h": 66
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 250,
				"h": 66
			},
			"sourceSize": {
				"w": 250,
				"h": 66
			}
		},
		"frame-part-3": {
			"frame": {
				"x": 754,
				"y": 78,
				"w": 188,
				"h": 16
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 188,
				"h": 16
			},
			"sourceSize": {
				"w": 188,
				"h": 16
			}
		},
		"frame-part-4": {
			"frame": {
				"x": 942,
				"y": 10,
				"w": 80,
				"h": 86
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 80,
				"h": 86
			},
			"sourceSize": {
				"w": 80,
				"h": 86
			}
		},
		"frame-part-5": {
			"frame": {
				"x": 1022,
				"y": 0,
				"w": 512,
				"h": 30
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 512,
				"h": 30
			},
			"sourceSize": {
				"w": 512,
				"h": 30
			}
		},
		"frame-part-6": {
			"frame": {
				"x": 1508,
				"y": 30,
				"w": 24,
				"h": 982
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 24,
				"h": 982
			},
			"sourceSize": {
				"w": 24,
				"h": 982
			}
		},
		"frame-part-7": {
			"frame": {
				"x": 1006,
				"y": 990,
				"w": 502,
				"h": 22
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 502,
				"h": 22
			},
			"sourceSize": {
				"w": 502,
				"h": 22
			}
		},
		"frame-part-8": {
			"frame": {
				"x": 946,
				"y": 922,
				"w": 76,
				"h": 68
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 76,
				"h": 68
			},
			"sourceSize": {
				"w": 76,
				"h": 68
			}
		},
		"frame-part-9": {
			"frame": {
				"x": 754,
				"y": 922,
				"w": 192,
				"h": 18
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 192,
				"h": 18
			},
			"sourceSize": {
				"w": 192,
				"h": 18
			}
		},
		"frame-part-10": {
			"frame": {
				"x": 694,
				"y": 854,
				"w": 76,
				"h": 68
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 76,
				"h": 68
			},
			"sourceSize": {
				"w": 76,
				"h": 68
			}
		},
		"frame-part-11": {
			"frame": {
				"x": 502,
				"y": 854,
				"w": 192,
				"h": 18
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 192,
				"h": 18
			},
			"sourceSize": {
				"w": 192,
				"h": 18
			}
		},
		"frame-part-12": {
			"frame": {
				"x": 456,
				"y": 786,
				"w": 64,
				"h": 68
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 64,
				"h": 68
			},
			"sourceSize": {
				"w": 64,
				"h": 68
			}
		},
		"frame-part-13": {
			"frame": {
				"x": 252,
				"y": 786,
				"w": 204,
				"h": 18
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 204,
				"h": 18
			},
			"sourceSize": {
				"w": 204,
				"h": 18
			}
		},
		"frame-part-14": {
			"frame": {
				"x": 214,
				"y": 714,
				"w": 56,
				"h": 72
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 56,
				"h": 72
			},
			"sourceSize": {
				"w": 56,
				"h": 72
			}
		},
		"frame-part-15": {
			"frame": {
				"x": 28,
				"y": 708,
				"w": 186,
				"h": 24
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 184,
				"h": 24
			},
			"sourceSize": {
				"w": 184,
				"h": 24
			}
		},
		"frame-part-16": {
			"frame": {
				"x": 0,
				"y": 276,
				"w": 28,
				"h": 456
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 28,
				"h": 456
			},
			"sourceSize": {
				"w": 28,
				"h": 456
			}
		},
		"frame-part-17": {
			"frame": {
				"x": 274,
				"y": 0,
				"w": 180,
				"h": 236
			},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": 180,
				"h": 236
			},
			"sourceSize": {
				"w": 180,
				"h": 236
			}
		}
	};

	var q = 0.5;

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
