define (function () {
	var itemsData = {

		wildX3: {
			frame: 'item-wild-x3',
			hi: 3,
			index: 0,
			offset: {
				x: 0,
				y: -5
			}
		},
		bonusX3: {
			frame: 'item-bonus-x3',
			hi: 3,
			index: 1,
			offset: {
				x: 0,
				y: -7
			}
		},
		wildViolet: {
			frame: 'item-wild-violet',
			hi: 1,
			index: 2,
			offset: {
				x: 0,
				y: -8
			}
		},
		wildGreen: {
			frame: 'item-wild-green',
			hi: 1,
			index: 3,
			offset: {
				x: 0,
				y: -8
			}
		},
		girl: {
			frame: 'item-girl',
			hi: 1,
			index: 4,
			offset: {
				x: 0,
				y: -11
			}
		},
		lion: {
			frame: 'item-lion',
			hi: 1,
			index: 5,
			offset: {
				x: 0,
				y: -13
			}
		},
		woodcutter: {
			frame: 'item-woodcutter',
			hi: 1,
			index: 6,
			offset: {
				x: 0,
				y: -24
			}
		},
		scarecrow: {
			frame: 'item-scarecrow',
			hi: 1,
			index: 7,
			offset: {
				x: 0,
				y: -15
			}
		},
		dog: {
			frame: 'item-dog',
			hi: 1,
			index: 8,
			offset: {
				x: 0,
				y: -8
			}
		},
		poppy: {
			frame: 'item-poppy',
			hi: 1,
			index: 9,
			offset: {
				x: 0,
				y: -2
			}
		},
		crow: {
			frame: 'item-crow',
			hi: 1,
			index: 10,
			offset: {
				x: 0,
				y: -6
			}
		},
		diamond: {
			frame: 'item-diamond',
			hi: 1,
			index: 11,
			offset: {
				x: 32,
				y: 2
			}
		},
		club: {
			frame: 'item-club',
			hi: 1,
			index: 12,
			offset: {
				x: 30,
				y: 1
			}
		},
		spades: {
			frame: 'item-spades',
			hi: 1,
			index: 13,
			offset: {
				x: 30,
				y: 2
			}
		},
		heart: {
			frame: 'item-heart',
			hi: 1,
			index: 14,
			offset: {
				x: 31,
				y: 5
			}
		},
		q: {
			frame: 'item-q',
			hi: 1,
			index: 15,
			offset: {
				x: 0,
				y: -21
			}
		},
		ring: {
			frame: 'item-ring',
			hi: 1,
			index: 16,
			offset: {
				x: 0,
				y: -25
			}
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