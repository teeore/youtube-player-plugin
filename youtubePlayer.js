/*******************************************/
/*       EAGL YouTube Overlay Player       */
/*******************************************/

/** settings to include with the embed

	//required scripts:
 	jquery-1.4.2.min.js (jquery-1.4.2.min.js or higher recommended)

 	//this is the only required variable
	id = 'LY67dAT22Pc' - youtube video id 

	//variables can be defined
	YTplayerWidth = 676 - player width  
    YTplayerHeight = 396 - player height 
 
**/

var YTOverlayPlayer = function() {

	var that = {};
    var player;

    that.id = '';
    that.YTplayerWidth = 676;
    that.YTplayerHeight = 396;

    var playing = false;
    var isIE8 = false;
    var isAutoPlay = false;
    var isTriggeredToPlay = false;
    var autoPlayTimeout;

    that.loadYouTubeAPI = function() {
    	var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		isIE8 = that.checkIE8();
    },


    that.autoPlay = function() {
 		if (!isIE8) {
 			autoPlayTimeout = window.setTimeout(function(){
 				if (!isTriggeredToPlay) {
 					isTriggeredToPlay = true;
					that.loadVideo(that.id);
				}	
				window.clearTimeout(autoPlayTimeout);
				isAutoPlay = false;
			}, 3000);
 		}
    }
 
	that.open = function(id) {
   		if (!isTriggeredToPlay) {
   			isTriggeredToPlay = true;
   			window.clearTimeout(autoPlayTimeout);
 			that.loadVideo(id);
 		}
 	},

 	that.loadVideo = function(id){
 
 		if (!isIE8) {
			that.openOverlay();
			that.createPlayerContainer();

			if (id == '' || id == null){
				id = that.id; 
			}

	 		player = new YT.Player('YTPlayer', {
			    height: that.YTplayerHeight,
			    width:  that.YTplayerWidth,
			    videoId: id,
			    suggestedQuality: 'hd720',
			    playerVars: {
			    	 wmode: "opaque",
					 rel: 0
  			    },	 
			    events: {
			      'onReady': onPlayerReady,
			      'onStateChange': onPlayerStateChange,
			      'onError': onPlayerError
			    }
			});

			
			 
		} else {
 
			var youtubeUrl = 'http://www.youtube.com/embed/'+that.id+'?rel=0&autoplay=1';
			var left = (screen.width - that.YTplayerWidth)/2;
			var	top = (screen.height - that.YTplayerHeight)/2;

			var strWindowFeatures = 'width=' + that.YTplayerWidth + ', height=' + that.YTplayerHeight  + ', left= ' + left + ', top= '+ top + 'scrollbars=yes,resizable=yes';
			var youtubePopup = window.open(youtubeUrl, '', strWindowFeatures);
 			 
		}	

 	}

	onPlayerError = function(event) {
		console.log(event)
	},


    onPlayerReady = function(event) {
 		var touchEnabled = that.touchEventDetect();
 		event.target.unMute();
 		event.target.setVolume(40); 
        if (!touchEnabled) { 
         	event.target.setPlaybackQuality('hd720');
         	event.target.playVideo();
        }  
	},

	onPlayerStateChange = function(event){
		var touchEnabled = that.touchEventDetect();
		var screenSize =  window.screen.width;

		if (event.data == YT.PlayerState.PLAYING) {
			if(playing == false) {
                playing = true;
                if (sCode) {
					sCode.trackVideo('trailer', 'start');
				}
			}	
		} 	

	},


	that.createPlayerContainer = function() {
		var playerContainer;
		
		if ($.browser.msie) {
			playerContainer = '<div id="YTPlayerContainer"><div id="ie-wrapper"><div id="YTPlayer"></div></div><div id="YTPlayerCloseButton"></div></div>'; //adds extra wrappe to remove outlines on iframe in IE 
		} else {
			playerContainer = '<div id="YTPlayerContainer"><div id="YTPlayer"></div><div id="YTPlayerCloseButton"></div></div>';
		}

 		$(playerContainer).appendTo($('body'));

 		that.setCloseOverlay();
	},


	that.setCloseOverlay = function() {

		var closeBtn = $('#YTPlayerCloseButton');
		var overlay = $('.yt-overlay');
		var videoContainer = $('#YTPlayerContainer'); 

		closeBtn.unbind('click');
		closeBtn.bind('click', function(e){
		 	e.preventDefault();
		 	destroyOverlay();
		});

		overlay.unbind('click');
		overlay.bind('click', function(e){
		 	e.preventDefault();
		 	destroyOverlay();
		});

		function destroyOverlay() {
			$(overlay).remove();
			$(videoContainer).remove();

			player.destroy();
			playing = false;
			isTriggeredToPlay = false;
		}
 	},

	that.openOverlay = function() {
		var overlay = new ytOverlayCreator({id:'yt-overlay'});
		overlay.open();
	},


	that.touchEventDetect = function(){
		 return !!('ontouchstart' in window) || !!('onmsgesturechange' in window); 
	}


    that.checkIE8 = function() {
    	if (($.browser.msie) && (parseInt($.browser.version)<9)) {
    		return true;
    	} else {
    		return false;
    	}
    }

 
	return that;

}

/*********
 *Overlay*
 ********/
var ytOverlayCreator = function(options) {

	var that = {};
	options = options || {id:'yt-overlay'};
	var element = $('<div id="'+options.id+'" class="yt-overlay">');
	
	that.open = function(){
		var body = $('body');
		
		element.css({height:$(document).height()+'px'});
		
		element.bind('click',function(e){
			that.close();
		});
		
		body.append(element);
		
		if(options.openCallback)
			options.openCallback(element);
	}
	
	that.close = function(){
		element.remove();	
		if(options.closeCallback)
			options.closeCallback(element);
	}
	
	that.setCloseCallback = function(callback){
		options.closeCallback = callback;
	}
	
	that.self = function(){
		return element;
	}
	
	return that;

}

var YTOverlayPlayer = YTOverlayPlayer();
YTOverlayPlayer.loadYouTubeAPI();
 