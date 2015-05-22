
(function(){
	'use strict';
	var Viewport = (function() {
		var vp;
		
		function addViewport () {
			vp         = document.createElement('meta');
			vp.name    = "viewport";
			vp.id      = "customViewportAppNext";
			vp.content = "width=device-width, initial-scale=1";
			document.getElementsByTagName('head')[0].appendChild(vp);
		}

		function removeViewport () {
			vp.parentNode.removeChild(vp);
		}

		return {
			add:    addViewport,
			remove: removeViewport,
		}
	}());

	var App = (function(Viewport){
	  var q, app;

		var parseURL = function() {
			var query = {};
			var scriptTag = qs('#appScript');

			return query = {
				id:                scriptTag.getAttribute('data-id') || "",
				cnt:               scriptTag.getAttribute('data-count') || "20",
				cat:               scriptTag.getAttribute('data-category') || "",
				pbk:               scriptTag.getAttribute('data-postback') || "",
				bcolor:            scriptTag.getAttribute('data-buttonColor') || "",
				btext:             scriptTag.getAttribute('data-buttonText') || "Download",
				skipText:          scriptTag.getAttribute('data-skipText') || "Skip",
			}		
		};

		 var createIframe = function () {
			var iframe = document.createElement('iframe');
			
			iframe.src = 'iframe.html';
			iframe.id  = "appIframe";
			iframe.setAttributes({
				styles: {
					position:    'fixed',
					top:         "0",
					right:       "0",
					bottom:      "0",
					left:        "0",
					borderStyle: 'none',
					width:       '100%',
					height:      '100%',
				}
			});
			document.body.appendChild(iframe);
			return iframe;
		}

		var loadJSONP = function (url, callback, context) {
			var unique = 0;
			var name = "_jsonp_" + unique++;

			if (url.match(/\?/)) url += "&callback="+name;
			else url += "?callback="+name;

			// Create script
			var script  = document.createElement('script');
			script.type = 'text/javascript';
			script.src  = url;

			// Setup handler
			window[name] = function(data){
				callback.call((context || window), data);
				document.getElementsByTagName('head')[0].removeChild(script);
				script = null;
				delete window[name];
			};

			// Load JSON
			document.getElementsByTagName('head')[0].appendChild(script);
		}

		function success_jsonp (data) {
			Viewport.add();
			var iframe = createIframe();
			iframe.onload = function() {
				renderApp(data.apps, iframe.contentWindow.document)
			};
		}


		var renderApp = function(apps, iframeDocument) {
			var swiperContainer = qs('.swiper-container', iframeDocument);
			var mySwiper = new Swiper (swiperContainer, {
				loop:           true,
				slidesPerView:  1,
				centeredSlides: true,
				slidesPerView:  'auto',
				loopedSlides:   2
			});
		};


		function init() {
			q = parseURL();
			if (!q.id) {
				return
			};
			loadJSONP("https://admin.appnext.com/offerWallApi.aspx?&vs=1&id="+q.id+"&cnt="+q.cnt+"&cat="+q.cat, success_jsonp);
		}

		return {init:init}

	}( Viewport || {} ));
	window.App = App;
})();
App.init();