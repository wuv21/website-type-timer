$(document).ready(function() {
	var keysTime = [];
	var testString = "The quick brown fox jumps over the lazy dog";
	var testLastChar = testString.charAt(testString.length - 1).toUpperCase();

	function reset() {
		$('#keyboardInp').val('');
		$('#keyboardInp').prop('disabled', false);
		$('#results').val('');

		keysTime = [];
	}

	// record keystroke data when keyup happens inside textarea
	$('#keyboardInp').keyup(function(e) {
		var data = {
			time: e.timeStamp,
			keyCode: e.keyCode,
			keyString: e.key ? e.key : e.keyCode
		}

		keysTime.push(data);

		// test completed
		if ($(this).val() == testString && keysTime[keysTime.length - 1].keyCode == testLastChar.charCodeAt(0)) {
			$(this).prop('disabled', true);
			
			var parsedData = {
				duration: keysTime[keysTime.length - 1].time - keysTime[0].time,
				numKeys: keysTime.length,
				keysPressed: keysTime.map(function(x) {return x.keyString + ' (' + String(x.time - keysTime[0].time) + ')'}),
			};

			$('#results').text(JSON.stringify(parsedData, null, '\t'));
		}
	});

	$('#resetInp').click(function() {
		reset();
	});
});