$(document).ready(function() {
	var lastfm = new LastFM({
		apiKey:'93d2b112d71a23258406f6fb63d20daa',
		apiSecret:'d84b67b0a14492c9b5047e49e6d6f502'
	});
	var trackCount = null, username = null, algorithm = null;
	var $progressBar = $("#progressbar").progressbar({value: 0}).hide().append('<div id="progress-message"><span id="progress-text"></span> (<span id="progress-value">0</span>%)</div>');
	var $progressText = $("#progress-text", $progressBar);
	var $progressValue = $("#progress-value", $progressBar);
	var $resultsTable = $("#results > tbody");
	$("#recommendation-form").submit(function() {
		initialize();
		loadUserLibrary(username).done(function(localLibrary) {
			generateStatistics(localLibrary);
			if(algorithm == "Similar" || algorithm == "Popular") {
				$progressText.text("Finding similar tracks...");
				for(var i = 0; i < trackCount / 5; i++) {
					var max = -1, maxSignature = null;
					for(var signature in localLibrary) {
						if(localLibrary[signature].playcount > max) {
							max = localLibrary[signature].playcount;
							maxSignature = signature;
						}
					}
					addSimilarToChart(localLibrary[maxSignature], localLibrary);
					localLibrary[maxSignature].playcount = -1;
				}
			} else if(algorithm == "Neighbors") {
				$progressText.text("Finding neighbors...");
				lastfm.user.getNeighbours({user:username}, {success:function(data) {
					$progressText.text("Finding neighbors' top tracks...");
					$.each(data.neighbours.user, function(i, user) {
						if(i < trackCount / 5) {
							addUserToChart(data.neighbours.user[i], localLibrary);
						}
					});
				}, error:function(code, message){
					renderError(message);
					finish();
				}});
			}
		});
		return false;
	});
	var libraryScrobbleCount = 0, libraryPlayCount = 0;
	function generateStatistics(localLibrary) {
		libraryScrobbleCount = 0;
		libraryPlayCount = 0;
		for(var signature in localLibrary) {
			libraryScrobbleCount++;
			libraryPlayCount += parseInt(localLibrary[signature].playcount);
		}
		showStatisticsMessage(libraryScrobbleCount, libraryPlayCount);
	}
	function initialize() {
		$("input[type=submit]").attr('disabled', true);
		$("#errors > div").each(function() {
			$(this).slideUp();
		});
		$resultsTable.html("");
		$progressBar.progressbar("value", 0).slideDown();
		$progressText.text("");
		$progressValue.text(0);
		username = $("#input-username").val();
		trackCount = $("#select-similar-track-count").val();
		algorithm = $("input[name=algorithm]:checked").val();
	}
	function finish() {
		$progressBar.slideUp();
		$("input[type=submit]").removeAttr('disabled');
	}
	
	function getTrackProgress() {
		return (getGroupProgress() / trackCount);
	}
	function getGroupProgress() {
		return (5 / trackCount);
	}
	function incrementProgress(amount) {
		$progressBar.progressbar("value", ($progressBar.progressbar("value") + amount * 100));
		$progressValue.text((Math.round($progressBar.progressbar("value") * 10) / 10).toFixed(1));
		if(Math.abs(100 - $progressBar.progressbar("value")) < 0.001) {
			finish();
		}
	}
	function showStatisticsMessage(uniqueSongs, totalPlayCount) {
		var average = Math.round(10 * totalPlayCount / uniqueSongs) / 10;
		renderMessage('highlight', 'Your library has ' + uniqueSongs + ' song' + (uniqueSongs == 1 ? '' : 's') + '. Each song has been played an average of ' + average + ' time' + (average == 1 ? '' : 's') + '.');
	}
	function renderError(message) {
		renderMessage('error', message);
	}
	function renderMessage(type, message) {
		$("<div class='ui-state-" + type + " ui-corner-all ui-widget'>" + message + "</div>").appendTo($("#errors")).hide().slideDown().click(function() {
			$(this).slideUp();
		});
	}
	function getTrackCount(username) {
		var deferred = $.Deferred();
		$progressText.text("Getting track count...");
		lastfm.library.getTracks({user:username, limit:1}, {success:function(data) {
			var trackCount = parseInt(data.tracks['@attr'].total);
			deferred.resolve(trackCount);
		}, error:function(code, message){
			renderError(message);
			finish();
		}});
		return deferred.promise();
	}
	function loadUserLibrary(username) {
		var deferred = $.Deferred();
		var library = {};
		getTrackCount(username).done(function(trackCount) {
			$progressText.text("Fetching your library...");
			var pages = Math.ceil(trackCount / 100);
			var pagesResolved = 0;
			for(var i = 0; i < pages; i++) {
				lastfm.library.getTracks({user:username, page:(i + 1), limit:100}, {success:function(data) {
					for(var j = 0; j < data.tracks.track.length; j++) {
						if(library[getTrackSignature(data.tracks.track[j])] === undefined) {
							library[getTrackSignature(data.tracks.track[j])] = {track:data.tracks.track[j].name, artist:data.tracks.track[j].artist.name, playcount:data.tracks.track[j].playcount};
						}
					}
					if((++pagesResolved) == pages) {
						deferred.resolve(library);
					}
				}, error:function(code, message){
					renderError(message);
					finish();
				}});
			}
		});
		return deferred.promise();
	}
	var signatureHashes = {};
	var signatureIndex = 0;
	function getTrackSignature(trackObject) {
		if(signatureHashes[(trackObject.name + trackObject.artist.name)] === undefined) {
			signatureHashes[(trackObject.name + trackObject.artist.name)] = signatureIndex++;
		}
		return signatureHashes[(trackObject.name + trackObject.artist.name)];
	}
	function addSimilarToChart(metadata, localLibrary) {
		lastfm.track.getSimilar({artist:metadata.artist, track:metadata.track, limit:$("#select-similar-track-count").val(), autocorrect:1}, {success:function(data) {
			if(data.similartracks['@attr'] !== undefined) {
				$.each(data.similartracks.track, function(index, track) {
					setTimeout(function() {
						if(algorithm == "Similar") {
							track.playcount = 1;
						}
						processTrack(track, localLibrary);
					}, index * 50);
				});
			} else {
				console.debug('Couldn\'t find ' + metadata.artist + ' - ' + metadata.track);
				incrementProgress(getGroupProgress());
			}
		}, error:function(code, message){
			renderError(message);
			incrementProgress(getGroupProgress());
		}});
	}
	function addUserToChart(user, localLibrary) {
		lastfm.library.getTracks({user:user.name, limit:$("#select-similar-track-count").val()}, {success:function(data) {
			$.each(data.tracks.track, function(index, track) {
				setTimeout(function() {
					processTrack(track, localLibrary);
				}, index * 50);
			});
		}, error:function(code, message) {
			renderError(message);
			incrementProgress(getGroupProgress());	
		}});
	}
	function processTrack(track, localLibrary) {
		if(localLibrary[getTrackSignature(track)] === undefined) {
			addWeight(track);
		}
		incrementProgress(getTrackProgress());
	}
	function addTrackToChart(track) {
		return $("<tr id='" + getTrackSignature(track) + "' playcount='0'><td class='name'><a href='" 
			+ track.url + "' target='_blank'>" + track.name + "</a></td><td class='artist'><a href='" 
			+ track.artist.url + "' target='_blank'>" + track.artist.name 
			+ "</a></td><td class='playcount'>0</td><td><a target='_blank' href='http://www.amazon.com/s/?tag=kevmo314-20&field-keywords=" + track.artist.name + "%20" + track.name + "'>"
			+ "Find on Amazon</a></td></tr>").appendTo($resultsTable);
	}
	function addWeight(track) {
		var $rowObject = $("#" + getTrackSignature(track), $resultsTable);
		if($rowObject.size() == 0) {
			$rowObject = addTrackToChart(track);
		}
		var newPlayCount = parseInt($rowObject.attr("playcount")) + parseInt(track.playcount);
		$rowObject.attr("playcount", newPlayCount);
		$rowObject.find(".playcount").text(newPlayCount);
		// Percolate up
		var previousSibling;
		while((previousSibling = $rowObject.prev()) != null && parseInt(previousSibling.attr("playcount")) < newPlayCount) {
			$rowObject.insertBefore(previousSibling);
		}
	}
});
