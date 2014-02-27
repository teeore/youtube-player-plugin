YTOverlayPlayer.id = 'ySSlz1Q3dpE';
 

function playVideo(){
    YTOverlayPlayer.open('ySSlz1Q3dpE');
}

function autoPlayVideo(){
	YTOverlayPlayer.autoPlay();
	$('.playvideo').click(function(e){
		e.preventDefault();
		playVideo();
	});
}

function initListeners(){

}

$(document).ready(function(){
	//playVideo();
	autoPlayVideo();
	initListeners();
});