var ytAttributes = {
	"containerId" : "yt-player",
	"height": "315",
	"width": "560",
	"id": "g9022BwG-QY",
	"suggestedQuality": "hd720",
	"trackingId": "trailer"
},
	ytPlayer,
	startTracking = false;

//load youtube api
$(document.createElement('script')).attr({"src":"//www.youtube.com/iframe_api"}).insertBefore($('script').eq(0));

function onYouTubeIframeAPIReady() {
	ytPlayer = new YT.Player(ytAttributes.containerId, {
		height: ytAttributes.height,
		width: ytAttributes.width,
		videoId: ytAttributes.id,
		suggestedQuality: ytAttributes.suggestedQuality,
		playerVars: {
			 wmode: "opaque",
			 rel: 0,
			 modestbranding: 1
		},
		events: {
			"onStateChange": onPlayerStateChange
		}
	})
}

function onPlayerStateChange(e) {			
	//video playing
	if(ytPlayer.getPlayerState() == 1) {
		//play head at start of video
		if(ytPlayer.getCurrentTime() < 1) {
			//track video start
			if(typeof(sCode) == 'object') {
				if(startTracking == false) {
					startTracking = true;
					sCode.trackVideo(ytAttributes.trackingId, 'start');
				}
			}
		}
	}
}
