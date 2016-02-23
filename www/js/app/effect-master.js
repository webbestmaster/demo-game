define (['./../lib/util', './effect-textures', './../lib/movie-clip-wrapper', './wheels-data'],
	function (util, effectTextures, MovieClipWrapper, wheelsData) {

	var effectMaster = {

		original: {
			full: {
				w: 780,
				h: 520
			}
		},

		clips: [],

		freeSpinPupUp: {
			clip: null,
			x: 780 / 2,
			y: 520 / 2
		},

		update: function () {

			// update clips states
			var clips = this.clips,
				i, len;

			for (i = 0, len = clips.length; i < len; i += 1) {
				clips[i].update();
			}

		},

		getCellPosition: function (x, y) {

			var wheel = wheelsData.wheels[x];

			if (wheel.hi <= y) {
				return null;
			}

			return {
				x: wheel.x,
				y: wheel.y + y * wheelsData.item.h
			}

		},

		initSprites: function () {

			var effect = this;

			effect.initClubsMovies();
			effect.initRespinPopUpMovies();
			//effect.initSparklesMovies();

		},

		initClubsMovies: function () {

			var effect = this;

			var frames = [];

			for (var i = 0; i < 105; i++) {
				frames.push('club-' + i);
			}

			for (i = 0; i < 6; i += 1) {

				for (var j = 0; j < 7; j += 1) {

					var position = effect.getCellPosition(i, j);

					if (!position) {
						continue;
					}

					var movie = PIXI.extras.MovieClip.fromFrames(frames);
					effect.stage.addChild(movie);


					movie.position.x = position.x;
					movie.position.y = position.y;

					var movieClipWrapper = new MovieClipWrapper(movie);
					effect.clips.push(movieClipWrapper);

					movieClipWrapper.className = 'club';

					// extraData
					movieClipWrapper.x = i;
					movieClipWrapper.y = j;

					movieClipWrapper.hide();

					//movieClipWrapper.play();

				}

			}

		},

		initRespinPopUpMovies: function () {

			return;

			var effect = this;

			var frames = [];

			for (var i = 0; i < 81; i++) {
				frames.push('respin-pop-up-' + i);
			}

			var movie = PIXI.extras.MovieClip.fromFrames(frames);
			effect.stage.addChild(movie);

			movie.anchor.x = 0.5;
			movie.anchor.y = 0.5;

			movie.position.x = effect.freeSpinPupUp.x;
			movie.position.y = effect.freeSpinPupUp.y;

			var movieClipWrapper = new MovieClipWrapper(movie);
			//effect.clips.push(movieClipWrapper);

			effect.freeSpinPupUp.clip = movieClipWrapper;

			movieClipWrapper.hide();

			//movieClipWrapper.play();

		},

		initSparklesMovies: function () {

			return;

			var effect = this;

			var frames = [];

			for (var i = 0; i < 3; i++) {
				frames.push('i/game/effect/sparkles/sparkles-' + i + '.png');
			}

			var movie = PIXI.extras.MovieClip.fromImages(frames);
			effect.stage.addChild(movie);

			movie.position.x = 240;
			movie.position.y = 35;

			movie.rotation = Math.PI / 2;
			movie.anchor.x = 0.2;
			movie.anchor.y = 0.2;
			//movie.scale.x = 0.3333;
			//movie.scale.y = 0.3333;

			movie.animationSpeed = 0.1;

			var movieClipWrapper = new MovieClipWrapper(movie);
			effect.clips.push(movieClipWrapper);

			movieClipWrapper.className = 'sparkle';

			movieClipWrapper.play();

		},

		showWinClubs: function (positions) {

			var clubs = [];

			var effect = this;
			var clips = effect.clips;

			positions.forEach(function (y, x) {

				clips.forEach(function (clip) {

					if (clip.className !== 'club') {
						return;
					}

					if (clip.x !== x || clip.y !== y) {
						return;
					}

					clubs.push(clip);

				});

			});

			clubs.forEach(function (club) {
				club.show();
				club.play();
			});

		},

		hideClips: function () {

			var effect = this;
			var clips = effect.clips;

			clips.forEach(function (clip) {
				clip.stop();
				clip.hide();
			});

			//effect.freeSpinPupUp.clip.stop();
			//effect.freeSpinPupUp.clip.hide();

		},

		showFreeSpinPopUp: function () {

			var freeSpinPupUp = this.freeSpinPupUp.clip;

			freeSpinPupUp.show();
			freeSpinPupUp.play();

		}

	};

	return effectMaster;
});