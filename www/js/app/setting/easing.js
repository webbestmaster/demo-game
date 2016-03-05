define(function () {

	var configSource = {
		fn: {
			// redefined eases
			back: {args: null},
			bounce: {args: null},
			circ: {args: null},
			cubic: {args: null},
			elastic: {args: null},
			quad: {args: null},
			quart: {args: null},
			quint: {args: null},
			sine: {args: null},
			// custom eases
			getBack: {args: 1},
			getElastic: {args: 2},
			getPow: {args: 1}
		}
	};

	var config = {
		linear: {args: null}
	};

	var key, value;

	var fn = configSource.fn;

	for (key in fn) {
		if (fn.hasOwnProperty(key)) {
			value = fn[key];
			['In', 'Out', 'InOut'].forEach(function (postfix) {
				config[key + postfix] = value;
			});
		}
	}

	return config;

});