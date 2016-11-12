$(document).ready(function() {
	var keysTime = [];
	var testString = "the quick brown fox jumps over the lazy dog";
	var testLastChar = testString.charAt(testString.length - 1).toUpperCase();

	function reset() {
		$('#keyboardInp').val('');
		$('#keyboardInp').prop('disabled', false);
		$('#results').val('');
		var container = document.getElementById('fileDownload')
		container.removeChild(container.childNodes[0]);

		keysTime = [];
	}

	// todo download static versions of jquery and bootstrap

	// record keystroke data when keyup happens inside textarea
	$('#keyboardInp').keypress(function(e) {
		var timeVanilla = Date.now();
		var timeQuery = parseInt(e.timeStamp.toFixed(6));

		var data = {
			ticks: timeQuery,
			seconds: timeQuery / 1000,
			keyCode: e.keyCode,
			keyString: e.key ? e.key : e.keyCode,
			ticksVanilla: timeVanilla,
			secondsVanilla: timeVanilla / 1000
		}

		keysTime.push(data);
		console.log(data);

		// test if enter is pressed
		if (e.keyCode == "13") {
			$(this).prop('disabled', true);
			
			// var parsedData = {
			// 	duration: keysTime[keysTime.length - 1].time - keysTime[0].time,
			// 	numKeys: keysTime.length,
			// 	keysPressed: keysTime.map(function(x) {return x.keyString + ' (' + x.ticks + ')'}),
			// };

			// $('#results').text(JSON.stringify(parsedData, null, '\t'));

			var jsonExport = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(keysTime));

			var a = document.createElement('a');
			a.href = 'data:' + jsonExport;
			a.download = 'keysTime.json';
			a.innerHTML = 'download JSON';

			var container = document.getElementById('fileDownload');
			container.appendChild(a);
		}
	});

	$('#resetInp').click(function() {
		reset();
	});
});