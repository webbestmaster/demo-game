require(
	[
		'./app/game',
		'./app/setting/view',
		'./lib/tweenjs-0.6.2.min', // fps tweenjs has no AMD version, just load it for crate FPSMeter globally
		'./services/fpsmeter' // fps meter has no AMD version, just load it for crate FPSMeter globally
	],
	function (game, settingView) {

		settingView.init();

		game.initialize(function () {
			console.log('inited');
		});

	}
);