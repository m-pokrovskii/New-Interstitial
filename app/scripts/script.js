
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
				cnt:               scriptTag.getAttribute('data-count') || "5",
				cat:               scriptTag.getAttribute('data-category') || "",
				pbk:               scriptTag.getAttribute('data-postback') || "",
				bcolor:            scriptTag.getAttribute('data-buttonColor') || "",
				btext:             scriptTag.getAttribute('data-buttonText') || "Install Free!",
				skipText:          scriptTag.getAttribute('data-skipText') || "skip",
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
			
			var prepareSlides = function() {
				var swiperSlideTemplate   = qs('.swiper-slide', iframeDocument).parentNode.removeChild(qs('.swiper-slide', iframeDocument));
				var swiperWrapper = qs('.swiper-wrapper', iframeDocument);
				var slides = document.createDocumentFragment();
				apps.forEach(function(element, index){
					var slide = swiperSlideTemplate.cloneNode(true);
					qs('.js-modal_main_img_itm', slide).src            = element.urlImg;
					qs('.js-modal_itm_info_title', slide).innerHTML    = element.title;
					qs('.js-modal_itm_info_text', slide).innerHTML     = element.desc;
					qs('.js-modal_itm_info_btn', slide).innerHTML      = q.btext;					
					slides.appendChild(slide);
				});
				
				swiperWrapper.appendChild(slides);
			};
			
			var initSwiper = function(swiperContainer, appsCount) {
				var mySwiper;
				window.addEventListener("resize", function() {
					if(window.innerWidth > window.innerHeight){
							// landscape
							if (mySwiper) {
								mySwiper.destroy(true, true);
							};
							mySwiper = new Swiper (swiperContainer, {
								loop:           true,
								centeredSlides: true,
								slidesPerView:  'auto',
								direction:      'vertical',
								loopedSlides:   Math.round(appsCount/2)
							});
							mySwiper.update();
					} else {
						// portrait
						if (mySwiper) {
							mySwiper.destroy(true, true);
						};
						mySwiper = new Swiper (swiperContainer, {
							loop:           true,
							centeredSlides: true,
							direction:      'horizontal',
							slidesPerView:  'auto',
							loopedSlides:   Math.round(appsCount/2)
						});
						mySwiper.update();
					}
				}, false);
				window.dispatchEvent(new Event('resize'));			
			};

			qs('.js-modal_itm_info_foot_btn', iframeDocument).innerHTML = q.skipText;
			prepareSlides();
			initSwiper(swiperContainer, apps.length);
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