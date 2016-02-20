function EndlessArray(length) {

	var endlessArray = this;

	endlessArray.length = length;

	endlessArray.array = new Array(length);

	endlessArray.cursor = 0;

}

EndlessArray.prototype.push = function (item) {

	this.array[this.cursor] = item;

	if (this.cursor === this.length - 1) {
		this.cursor = 0;
	} else {
		this.cursor += 1;
	}

	return this;

};

EndlessArray.prototype.each = function (fn) {

	var cursor = this.cursor;
	var array = this.array;

	var i, len;

	for (i = cursor, len = this.length; i < len; i += 1) {
		fn(array[i]);
	}

	for (i = 0; i < cursor; i += 1) {
		fn(array[i]);
	}

	return this;

};

EndlessArray.prototype.get = function (i) {

	var len = this.length;
	var index = this.cursor + i;

	if (index < len) {
		return this.array[index];
	}

	return this.array[index % len];

};

// extra method
// TODO: remove it if this method is needless
EndlessArray.prototype.average = function () {

	var array = this.array;

	var i, len;
	var sum = 0;

	for (i = 0, len = this.length; i < len; i += 1) {
		sum += array[i];
	}

	return sum / len;

};


/*
// just for tests
var tt = new EndlessArray(5);
tt.push(1);
tt.push(2);
tt.push(3);
tt.push(4);
tt.push(5);

window.tt = tt;
*/

export default EndlessArray;