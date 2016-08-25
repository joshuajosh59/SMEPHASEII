(function ($) {
    Drupal.behaviors.scrollDepth = {
        attach: function (context, settings) {

            // Debug flag
            var debugMode = false;

            var callBackTime = 100;
            

            // # px before tracking a reader
            var readerLocation = 150;

            // Set some flags for tracking & execution
            var timer = 0;
            var scroller = false;
            var endContent = false;
            var didComplete = false;

            // Set some time variables to calculate reading time
            var startTime = new Date();
            var beginning = startTime.getTime();
            var totalTime = 0;

            // Get some information about the current page
            var pageTitle = document.title;
            var pagePath = window.location.pathname;

            // Track the aticle load
            if (!debugMode) {
                ga('send', 'event', 'ReadingBehaviour', 'ArticleViewed', pageTitle, {'page': pagePath ,'nonInteraction': 1});

            } else {
                alert('The page has loaded. Woohoo.');
            }


            // Check the location and track user

            function trackLocation() {
                bottom = $(window).height() + jQuery(window).scrollTop();
                height = $(document).height();
                commentsHeight = $('.node-type-article #disqus_thread').innerHeight();
                articleOffset = $('.node-type-article #content').offset().top;
                articleHeight = ($('.node-type-article #content').innerHeight() + articleOffset) - commentsHeight;

                // If user has hit the bottom of the content send an event
                if (bottom >= articleHeight && !endContent) {
                    currentTime = new Date();
                    contentScrollEnd = currentTime.getTime();
                    timeToContentEnd = Math.round((contentScrollEnd - beginning) / 1000);

                    if (!debugMode) {
                        if (timeToContentEnd > 30) {
                            ga('set', 'ReadType', 'FullRead');

                        } else {
                            ga('set', 'ReadType', 'QuickView');

                        }
                        ga('send', 'event', 'ReadingBehaviour', 'ContentBottom', pageTitle, {'page': pagePath});

                    } else {
                        alert('end content section ' + timeToContentEnd);
                    }
                    endContent = true;
                }
            }

            // Track the scrolling and track location
            jQuery(window).scroll(function() {

                if (timer) {
                    clearTimeout(timer);
                }

                // Use a buffer so we don't call trackLocation too often.
                timer = setTimeout(trackLocation, callBackTime);
            });


        }
    };
}(jQuery));
;
