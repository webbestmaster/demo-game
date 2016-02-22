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
