require (['./app/game', './app/setting/view'], function (game, settingView) {

	settingView.init();

	game.initialize(function () {
		console.log('inited');
	});
});