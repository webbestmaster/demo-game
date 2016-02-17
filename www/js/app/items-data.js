var itemsData = {

	wildX3: {
		frame: 'item-wild-x3',
		hi: 3,
		index: 0
	},
	bonusX3: {
		frame: 'item-bonus-x3',
		hi: 3,
		index: 1
	},
	wildViolet: {
		frame: 'item-wild-violet',
		hi: 1,
		index: 2
	},
	wildGreen: {
		frame: 'item-wild-green',
		hi: 1,
		index: 3
	},
	girl: {
		frame: 'item-girl',
		hi: 1,
		index: 4
	},
	lion: {
		frame: 'item-lion',
		hi: 1,
		index: 5
	},
	woodcutter: {
		frame: 'item-woodcutter',
		hi: 1,
		index: 6
	},
	scarecrow: {
		frame: 'item-scarecrow',
		hi: 1,
		index: 7
	},
	dog: {
		frame: 'item-dog',
		hi: 1,
		index: 8
	},
	poppy: {
		frame: 'item-poppy',
		hi: 1,
		index: 9
	},
	crow: {
		frame: 'item-crow',
		hi: 1,
		index: 10
	},
	diamond: {
		frame: 'item-diamond',
		hi: 1,
		index: 11
	},
	club: {
		frame: 'item-club',
		hi: 1,
		index: 12
	},
	spades: {
		frame: 'item-spades',
		hi: 1,
		index: 13
	},
	heart: {
		frame: 'item-heart',
		hi: 1,
		index: 14
	}

};

// init data

var list = [];
var item;

for (var key in itemsData) {
	if (itemsData.hasOwnProperty(key)) {
		item = itemsData[key];
		list[item.index] = key;
	}
}

itemsData.list = list;

export default itemsData;