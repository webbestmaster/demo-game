var itemWidth = 125;
var itemHeight = 70;
var itemHalfHeight = 35;
var startX = 18;
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
	}
};

export default wheelsData;