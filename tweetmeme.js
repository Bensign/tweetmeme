$(function () {

    /* Setup dem vars */
    var MENTIONS = $('.bls a').toArray(),
        $tweetmeme_container = prepareDialog(),
        $current_mention;

    /* Just get the div in place for displaying tweets */
    function prepareDialog() {

        /* Assemble the nifty overlay */
        var overlay = document.createElement("div"),
            div = document.createElement("div");

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

        div.setAttribute("id", "tweetmeme");
        div.style.width = "600px";
        div.style.margin = "50px auto 0 auto";
        div.style.zIndex = 100;
        document.getElementById("tweetmeme-overlay").appendChild(div);

        /* Bind event for dismissal */
        $("#tweetmeme-overlay").on('click', function () {
            $(this).hide();
            unsetBindings();
        });

        return $('#tweetmeme');
    }

    /* 
      When an overlay is show, lets add 
      key bindings for simple navigation 
    */
    function setBindings(elem) {

        $current_mention = elem;
        var siblings_before = elem.prevAll(),
            siblings_after = elem.nextAll();

        /*  Prevent Double-binds, gurl */
        unsetBindings();

        /* Mother-fucking arrow-key navigation, bitches */
        $(document).keydown(function (e) {
            switch (e.which) {
            case 37: //left
                if (siblings_before.length > 0) {
                    displayTweet($current_mention.prev());
                }
                break;
            case 39: //right
                if (siblings_after.length > 0) {
                    displayTweet($current_mention.next());
                }
                break;
            }
        });
    }

    /*
      Let's unbind all key handlers when
      the tweetmeme overlay isn't present
    */
    function unsetBindings() {
        $(document).unbind('keydown');
    }

    /* Remove dat Tweet */
    function removeTweet() {
        if ($tweetmeme_container.html()) {
            $tweetmeme_container.attr('class').html('');
            $('#tweetmeme-overlay').hide();
        }
    }

    /* Extract the unique Twitter ID from the link */
    function extractID(elem) {
        if (elem && elem.attr('href')) {
            /* This could probably be done better, but #yolo */
            return elem.attr('href').split("/").pop();
        }
        return false;
    }

    /*
      Display the actual Tweet after 
      firing off a request to le Twitz
    */
    function displayTweet(elem) {

        var tweet_id = extractID(elem);

        $.ajax({
            url: 'https://api.twitter.com/1/statuses/oembed.json?id=' + tweet_id + '&callback=?',
            dataType: 'json',
            success : function (data) {
                $tweetmeme_container.attr('class', tweet_id).html(data.html);
                $("#tweetmeme-overlay").show();
                setBindings(elem);
            }
        });
    }

    /* Go through and find the corresponding links */
    MENTIONS.forEach(function (mention) {
        $(mention).on({
            click : function (e) {

                var $mention = $(this),
                    tweet_id = extractID($mention);

                if (!$tweetmeme_container.html() || !$tweetmeme_container.hasClass(tweet_id)) {
                    displayTweet($mention);
                } else {
                    removeTweet();
                }
                e.preventDefault();
            }
        });
    });
});