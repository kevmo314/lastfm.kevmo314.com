<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/Product" xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
		<meta itemprop="name" content="Last.fm Song Recommendation Tool">
		<meta itemprop="description" content="Get personalized song recommendations based on songs you've heard.">
		<link rel="stylesheet" type="text/css" href="/css/style.css"/>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
		<link type="text/css" href="/css/ui-lightness/jquery-ui-1.8.11.custom.css" rel="stylesheet" />
		<script type="text/javascript" src="jquery-ui-1.8.11.custom.min.js"></script>
		<script src="jquery.timeago.js" type="text/javascript"></script>
		<script type="text/javascript" src="lastfm.api.md5.js"></script>
		<script type="text/javascript" src="lastfm.api.js"></script>
		<script type="text/javascript" src="script.js"></script>
		<title>Last.fm Song Recommendation Tool</title>
	</head>
	<body>
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=132808596831032";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>		<div id="header">
			<h1>Last.fm Song Recommendation Tool</h1>
		</div>
		<div id="content">
			<p>This tool recommends songs that you have never scrobbled.</p>
			<form id="recommendation-form">
				<p>
					<label for="select-similar-track-count">Songs to use:</label>
					<select id="select-similar-track-count">
						<option value="20">20</option>
						<option value="50" selected="selected">50</option>
						<option value="100">100</option>
						<option value="150">150</option>
						<option value="200">200</option>
					</select>
				</p>
				<p>Choosing a higher number makes your recommendations more accurate, but uses much more CPU.  Leaving it at 50 songs is usually sufficient.</p>
				<fieldset>
					<legend>Calculation Algorithm</legend>
					<p><input type="radio" id="radio-similar-tracks" name="algorithm" value="Similar" /> <label for="radio-similar-tracks">Similar tracks of your top songs</label></p>
					<p>Recommendations are calculated based on how many times a track is noted to be similar to those in your library.</p>
					<p><input type="radio" id="radio-similar-tracks" name="algorithm" value="Popular" /> <label for="radio-popular-tracks">Popular tracks similar to your top songs</label></p>
					<p>Recommendations are calculated based on which tracks are most popular and similar to those in your library.</p>
					<p><input type="radio" id="radio-neighbor-tracks" name="algorithm" value="Neighbors" checked="checked" /> <label for="radio-neighbor-tracks">Top tracks of your neighbors</label></p>
					<p>Recommendations are calculated based on what your closest neighbors listen to.</p>
				</fieldset>
				<p>Your last.fm username: <input type="text" id="input-username"/></p>
				<input type="submit" value="Calculate"/>
			</form>
			<div id="progressbar"></div>
			<div id="errors"></div>
			<table id="results">
				<thead>
					<tr>
						<th>Song Title</th>
						<th>Artist</th>
						<th>Score</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
				
				</tbody>
			</table>
		</div>
		<div id="footer">
			<div id="share">
				<g:plusone size="medium" annotation="inline"></g:plusone>
				<br/><br/>
				<div class="fb-like" data-href="http://lastfm.kevmo314.com/" data-send="false" data-width="450" data-show-faces="false" data-font="tahoma"></div>
			</div>
			<p>Written by <a href="http://kevmo314.com/">Kevin Wang</a>, original idea by <a href="http://heathaze.org/">Aiman Ashraf</a>.</p>
			<p><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=kevmo314%40gmail%2ecom&lc=US&item_name=Last%2efm%20Recommendation%20Tool&no_note=1&no_shipping=1&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted" target="_blank">Donate</a> - <a href="http://www.google.com/recaptcha/mailhide/d?k=01fbb91zeC4MA-teSCV_coVQ==&c=0kc3kR_E4N1vGddZ7ZkQMQGad7JwDmPk-VeemG4NK68=" target="_blank">Contact (Hire me!)</a></p>
		</div>
		<script type="text/javascript">
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-19960251-4']);
			_gaq.push(['_trackPageview']);
			(function() {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
				ga.src = 'http://www.google-analytics.com/ga.js';
				po.src = 'http://apis.google.com/js/plusone.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); s.parentNode.insertBefore(po, s);
			})();
		</script>
	</body>
</html>