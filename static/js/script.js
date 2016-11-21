$(document).ready(function() {
	var testString = "the quick brown fox jumps over the lazy dog";
	var testLastChar = testString.charAt(testString.length - 1).toUpperCase();

	var settings = {
		test: 1,
		total: 3
	}

	var phrases = [];
	$.get('../static/phrases/phrases2.txt', function(data) {
		phrases = data.split('\n');
	});

	var tracker = {
		count: 0,
		indexPhrases: [],
		results: [],
	}

	function setText(t) {
		$('#reqText').text(t.toLowerCase());
	}

	function changeRuns(x) {
		$('#runs').text(x + " of " + settings.total)
	}

	function getCurrentText() {
		return phrases[tracker.indexPhrases[tracker.count]];
	}

	function start() {
		$('#start').hide();
		$('#keyboardInp').prop('disabled', false);

		var indexes = [];
		for (var i = 0; i < phrases.length; i++) {
			indexes.push(i);
		}

		indexes = _.shuffle(indexes);
		tracker.indexPhrases = indexes.slice(0, settings.total);
		changeRuns(tracker.count + 1);
		setText(getCurrentText());
		$('#keyboardInp').focus();
	}

	$('#startBtn').click(start);

	var keysTime = [];
	$('#keyboardInp').keyup(function(e) {

		// not shift key
		if (e.keyCode != "16") {
			var timeVanilla = Date.now();
			var timeQuery = parseInt(e.timeStamp.toFixed(6));

			if (!e.key) {
				if (e.keyCode == 8) {
					e.key = "&#x8;"
				} else {
					e.key = String.fromCharCode(e.keyCode).toLowerCase();
				}
			}

			var data = {
				ticks: timeQuery,
				seconds: timeQuery / 1000,
				keyCode: e.keyCode ? e.keyCode : 8,
				keyString: e.key != "Backspace" ? e.key : "&#x8;",
				ticksVanilla: timeVanilla * 10000,
				secondsVanilla: timeVanilla / 10000000
			}

			keysTime.push(data);
		}

		// when enter is pressed
		if (e.keyCode == "13") {
			tracker.results.push({
				keysPressed: keysTime,
				orgString: getCurrentText(),
				compiledString: $(this).val(),
				isTest: tracker.count < settings.test  	
			});

			tracker.count++
			if (tracker.count < settings.total) {
				keysTime = [];
				$(this).val('');
				changeRuns(tracker.count + 1);
				setText(getCurrentText());
			} else {
				setText("Finished")
				$(this).val('');				
				$(this).prop('disabled', true);

				console.log(tracker);

				// change localhost to router IP

				$.post('http://192.168.1.124:8080/send_results', JSON.stringify(tracker))
					.success(function() {
						console.log("Data successfully sent");
					}).error(function(e) {
						console.log(e);
					});
			}
		}
	})
});