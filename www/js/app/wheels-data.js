define (function () {
	var itemWidth = 125;
	var itemHeight = 70;
	//var itemSpriteHeight = 94;
	var itemHalfHeight = 35;
	var startX = 17;
	var startY = 160;

	var wheelsData = {
		wheelItemCount: 12,
		wheels: [
			{
				x: startX,
				y: startY,
				hi: 3
			},
			{
				x: startX + itemWidth,
				y: startY - itemHalfHeight,
				hi: 4
			},
			{
				x: startX + itemWidth * 2,
				y: startY - itemHalfHeight * 2,
				hi: 5
			},
			{
				x: startX + itemWidth * 3,
				y: startY - itemHalfHeight * 3,
				hi: 6
			},
			{
				x: startX + itemWidth * 4,
				y: startY - itemHalfHeight * 4,
				hi: 7
			},
			{
				x: startX + itemWidth * 5,
				y: startY - itemHalfHeight * 4,
				hi: 7
			}
		],
		item: {
			w: itemWidth,
			h: itemHeight
		},
		// http://www.createjs.com/demos/tweenjs/tween_sparktable
		config: {
			begin: {
				timingFunction: {
					name: 'getBackIn', 		// game of timing function
					args: [2] 				// arguments for timing function
					// args: [] -> createjs.Ease[timingFunction]()
					// args: [1, 2] -> createjs.Ease[timingFunction].apply(createjs.Ease, [1, 2])
					// args: !!your_value === false -> createjs.Ease[timingFunction]
				},
				timeAspect: 1, 				// main time aspect
				linearPathSize: 2,			// linear path from begin to end of animation ..item
				time: 500					// time of animation ..ms
			},

			end: {
				timingFunction: {
					name: 'bounceOut', 		// game of timing function
					args: null 				// arguments for timing function
				},
				timeAspect: 1, 				// main time aspect
				linearPathSize: 2,			// linear path from begin to end of animation ..item
				time: 1500					// time of animation ..ms
			},

			main: {
				speed: 20,					// items per one unit of the time
				timeAspect: 1
			}

		}

	};

	return wheelsData;
});