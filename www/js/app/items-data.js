define (function () {
	var itemsData = {

		wildX3: {
			frame: 'item-wild-x3',
			hi: 3,
			index: 0,
			bg: false
		},
		bonusX3: {
			frame: 'item-bonus-x3',
			hi: 3,
			index: 1,
			bg: false
		},
		wildViolet: {
			frame: 'item-wild-violet',
			hi: 1,
			index: 2,
			bg: false
		},
		wildGreen: {
			frame: 'item-wild-green',
			hi: 1,
			index: 3,
			bg: false
		},
		girl: {
			frame: 'item-girl',
			hi: 1,
			index: 4,
			bg: false
		},
		lion: {
			frame: 'item-lion',
			hi: 1,
			index: 5,
			bg: false
		},
		woodcutter: {
			frame: 'item-woodcutter',
			hi: 1,
			index: 6,
			bg: false
		},
		scarecrow: {
			frame: 'item-scarecrow',
			hi: 1,
			index: 7,
			bg: false
		},
		dog: {
			frame: 'item-dog',
			hi: 1,
			index: 8,
			bg: true
		},
		poppy: {
			frame: 'item-poppy',
			hi: 1,
			index: 9,
			bg: true
		},
		crow: {
			frame: 'item-crow',
			hi: 1,
			index: 10,
			bg: true
		},
		diamond: {
			frame: 'item-diamond',
			hi: 1,
			index: 11,
			bg: true
		},
		club: {
			frame: 'item-club',
			hi: 1,
			index: 12,
			bg: true
		},
		spades: {
			frame: 'item-spades',
			hi: 1,
			index: 13,
			bg: true
		},
		heart: {
			frame: 'item-heart',
			hi: 1,
			index: 14,
			bg: true
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

	return itemsData;
});