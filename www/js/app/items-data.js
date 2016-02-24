define (function () {
	var itemsData = {

		wildX3: {
			frame: 'item-wild-x3',
			hi: 3,
			index: 0,
			offset: {
				x: 0,
				y: 3
			},
			bg: {
				offset: {
					x: 0,
					y: 204
				},
				h: 15
			}
		},
		bonusX3: {
			frame: 'item-bonus-x3',
			hi: 3,
			index: 1,
			offset: {
				x: 0,
				y: 0
			},
			bg: {
				offset: {
					x: 0,
					y: 204
				},
				h: 15
			}
		},
		wildViolet: {
			frame: 'item-wild-violet',
			hi: 1,
			index: 2,
			offset: {
				x: 0,
				y: 4
			},
			bg: {
				offset: {
					x: 0,
					y: 68
				},
				h: 10
			}
		},
		wildGreen: {
			frame: 'item-wild-green',
			hi: 1,
			index: 3,
			offset: {
				x: 0,
				y: 4
			},
			bg: {
				offset: {
					x: 0,
					y: 68
				},
				h: 10
			}
		},
		girl: {
			frame: 'item-girl',
			hi: 1,
			index: 4,
			offset: {
				x: 0,
				y: -1
			},
			bg: {
				offset: {
					x: 0,
					y: 66
				},
				h: 10
			}
		},
		lion: {
			frame: 'item-lion',
			hi: 1,
			index: 5,
			offset: {
				x: 0,
				y: -1
			},
			bg: {
				offset: {
					x: 0,
					y: 66
				},
				h: 10
			}
		},
		woodcutter: {
			frame: 'item-woodcutter',
			hi: 1,
			index: 6,
			offset: {
				x: 0,
				y: -3
			},
			bg: {
				offset: {
					x: 0,
					y: 60
				},
				h: 10
			}
		},
		scarecrow: {
			frame: 'item-scarecrow',
			hi: 1,
			index: 7,
			offset: {
				x: 0,
				y: -2
			},
			bg: {
				offset: {
					x: 0,
					y: 60
				},
				h: 10
			}
		},
		dog: {
			frame: 'item-dog',
			hi: 1,
			index: 8,
			offset: {
				x: 0,
				y: 3
			},
			bg: {
				offset: {
					x: 0,
					y: 0
				},
				h: 76
			}
		},
		poppy: {
			frame: 'item-poppy',
			hi: 1,
			index: 9,
			offset: {
				x: 0,
				y: 7
			},
			bg: {
				offset: {
					x: 0,
					y: 0
				},
				h: 76
			}
		},
		crow: {
			frame: 'item-crow',
			hi: 1,
			index: 10,
			offset: {
				x: 0,
				y: 4
			},
			bg: {
				offset: {
					x: 0,
					y: 0
				},
				h: 76
			}
		},
		diamond: {
			frame: 'item-diamond',
			hi: 1,
			index: 11,
			offset: {
				x: 31,
				y: 15
			},
			bg: {
				offset: {
					x: 0,
					y: 0
				},
				h: 76
			}
		},
		club: {
			frame: 'item-club',
			hi: 1,
			index: 12,
			offset: {
				x: 30,
				y: 15
			},
			bg: {
				offset: {
					x: 0,
					y: 0
				},
				h: 76
			}
		},
		spades: {
			frame: 'item-spades',
			hi: 1,
			index: 13,
			offset: {
				x: 30,
				y: 15
			},
			bg: {
				offset: {
					x: 0,
					y: 0
				},
				h: 76
			}
		},
		heart: {
			frame: 'item-heart',
			hi: 1,
			index: 14,
			offset: {
				x: 30,
				y: 23
			},
			bg: {
				offset: {
					x: 0,
					y: 0
				},
				h: 76
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