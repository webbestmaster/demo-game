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
			//itemDeltaTop: (itemSpriteHeight - itemHeight) / 2 // 94 - real sprite height, 70 visible sprite height
		}
	};

	return wheelsData;
});