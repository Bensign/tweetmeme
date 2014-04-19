$(function() {

	/* I believe this does the trick */
	var MENTIONS = $('.bls a').toArray();

	/* Prep the dialog for previewing */
	var $tweetmeme_container = prepareDialog();

	/* For navigation between tweets, we'll want to store this for ease */
	var $current_mention;

	/* Go through and find the corresponding links */
	MENTIONS.forEach(function(mention){
		$(mention).on({
			click : function(e){

				var $mention = $(this);

				/* 
						We'll also want to display a new Tweet if the 
						user clicks an alternate Twitter link
				*/
				var tweet_id = extractID($mention);

				if(!$tweetmeme_container.html() || !$tweetmeme_container.hasClass(tweet_id)){
					displayTweet($mention);
				}
				else{
					removeTweet();
				}
				e.preventDefault();
			}
		});
	});

	// Remove dat Tweet
	function removeTweet(elem){
		if($tweetmeme_container.html()){
			$tweetmeme_container.attr('class').html('');
			$('#tweetmeme-overlay').hide();
		}
	}

	/* Extract the unique Twitter ID from the link */
	function extractID(elem){
		if(elem && elem.attr('href')){
			// This could probably be done better, but #yolo
			return elem.attr('href').split("/").pop();
		}else{
			return false;
		}
	}

	/* 
			Display the actual Tweet after 
			firing off a request to le Twitz
	*/
	function displayTweet(elem) {

		var _id = extractID(elem);

		$.ajax({
 			url: 'https://api.twitter.com/1/statuses/oembed.json?id=' + _id + '&callback=?',
 			dataType: 'json',
 			success: function(data) {
  			$tweetmeme_container.attr('class', _id).html(data['html']);
 				$("#tweetmeme-overlay").show();
 				setBindings(elem);
    	}
    });
	}

	/* 
				When an overlay is show, lets add 
				key bindings for simple navigation 
	*/
	function setBindings(elem){

		$current_mention = elem;
		var siblings_before = elem.prevAll();
		var siblings_after = elem.nextAll();

		/*  Prevent Double-binds, gurl */
		unsetBindings();

		/* Arrow-key navigation, bitches */
		$(document).keydown(function(e){
			switch(e.which){
				case 37: //left
					if(siblings_before.length > 0){
						displayTweet($current_mention.prev());
					}
				case 39: //right
					if(siblings_after.length > 0){
						displayTweet($current_mention.next());
					}
			}
		});
	}

	/* 		
			Let's not mess with any key bindings 
			when the tweetmeme overlay isn't present
	*/
	function unsetBindings(){
		$(document).unbind('keydown');
	}

	/* Just get the div in place for displaying tweets */
	function prepareDialog(){

		// Assemble the nifty overlay
		var overlay = document.createElement("div");
		overlay.setAttribute("id", "tweetmeme-overlay");
		overlay.style.backgroundColor = "rgba(0,0,0,0.4)";
		overlay.style.width = "100%";
		overlay.style.height = "100%";
		overlay.style.top = "0px";
		overlay.style.left = "0px";
		overlay.style.display = "none";
		overlay.style.zIndex = 500;
		overlay.style.position = "fixed";
		document.body.appendChild(overlay);


		// Assemble the Container
		var div = document.createElement("div");
		div.setAttribute("id", "tweetmeme");
		div.style.width = "600px";
		div.style.margin = "50px auto 0 auto";
		div.style.zIndex = 100;
		document.getElementById("tweetmeme-overlay").appendChild(div);


		// Bind event for dismissal
		$("#tweetmeme-overlay").on('click', function(){
			$(this).hide();
			unsetBindings();
		});

		return $('#tweetmeme');
	}
});

























