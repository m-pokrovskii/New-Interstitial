'use strict';
Element.prototype.setAttributes = function (attrs) {
    for (var idx in attrs) {
        if ((idx === 'styles' || idx === 'style') && typeof attrs[idx] === 'object') {
            for (var prop in attrs[idx]){this.style[prop] = attrs[idx][prop];}
        } else if (idx === 'html') {
            this.innerHTML = attrs[idx];
        } else {
            this.setAttribute(idx, attrs[idx]);
        }
    }
};

NodeList.prototype.forEach = Array.prototype.forEach;
// 

var replaceJQ = (function(){
	
	function ready(fn) {
		if (document.readyState != 'loading'){
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	}

	function each (item, fn) {
		if(Object.prototype.toString.call(item) === '[object Object]') {
			for(var key in item) {
				if (item.hasOwnProperty(key)) {
					fn(key, item[key]);
				}
			}
		} else if (Array.isArray(item)) {
				item.forEach(function(val, key){
					fn(key, val);
				});
		}
	}

	return {
		ready: ready,
		each:  each
	}

}());

// 

var appnextAPP = (function(){
	
	var finalApps        = [],
			images           = [],
			CallbackRegistry = {},
			pkgNames         = [];

			var id = getURLParameter('android_id');
			if (id === undefined || id === '' || id === null) id = false;

			var bgc = getURLParameter('bgc');
			if (bgc === undefined || bgc === '' || bgc === null) bgc = 'fff';

			var bcolor = getURLParameter('bcolor');
			if (bcolor === undefined || bcolor === '' || bcolor === null) bcolor = '';

			var btitle = getURLParameter('btitle');
			if (btitle === undefined || btitle === '' || btitle === null) btitle = 'Download Free!';
			if (btitle) {
				btitle = btitle.substring(0, 20);
			};

			var cat = getURLParameter('cat');
			if (cat === undefined || cat === '' || cat === null) cat = '';

			var cnt = getURLParameter('cnt');
			if (cnt === undefined || cnt === '' || cnt === null) cnt = '1';

			var pbk = getURLParameter('pbk');
			if (pbk === undefined || pbk === '' || pbk === null) pbk = '';

			var device = getURLParameter('device');
			if (device === undefined || device === '' || device === null) device = '';

			var d = getURLParameter('d');
			if (d === undefined || d === '' || d === null) d = '';

			var vid = getURLParameter('vid');
			if (vid === undefined || vid === '' || vid === null) vid = '';

			var appn = getURLParameter('appn');
			if (appn === undefined || appn === '' || appn === null){
				appn = '';
			}else{
				appn = 'Welcome to '+appn.substring(0,15)+'<br> & Discover this Free App!';
			}
			var title = getURLParameter('title');
			if (title === undefined || title === '' || title === null) {
				title = 'Discover this Free App!';
			} else {
				title = title.substring(0,50);
			}

			if (appn!='')
			{
				title=appn;
			}


	function scriptRequest(url, onSuccess, onError) {
	 
		var scriptOk = false;
		var callbackName = 'f'+String(Math.random()).slice(2);

		url += ~url.indexOf('?') ? '&' : '?';
		url += 'callback=CallbackRegistry.'+callbackName;
		CallbackRegistry[callbackName] = function(data) {      
			scriptOk = true;
			delete CallbackRegistry[callbackName];
			onSuccess(data);
		};
		window.CallbackRegistry = CallbackRegistry;

		function checkCallback() {
			if (scriptOk) return;
			delete CallbackRegistry[callbackName];
			onError(url);
		}
	 
		var script = document.createElement('script'); 
	 
		script.onreadystatechange = function() {   
			if (this.readyState == 'complete' || this.readyState == 'loaded'){  
				this.onreadystatechange = null;  
				setTimeout(checkCallback, 0);
			}
		}
	 
		script.onload = script.onerror = checkCallback;
		script.src = url;
	 
		document.body.appendChild(script);
	 }

	function success_jsonp(data) {
			replaceJQ.each(data, function(key, val) {
					var dataAttr = data[key];
					replaceJQ.each(dataAttr, function(key, val) {
						pkgNames.push(val.androidPackage);	
					});
					window.location = 'appnext://pid:' + pkgNames;
					window.finalApps = dataAttr;
			});

			installedApps(); // remove in prodaction.
	}

	function fail_jsonp(url) {
		console.log('Error in query ' + url);
	}

	function getURLParameter(name) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
	}

	function installedApps(apps) {
		var indexes = [];
		if (apps) {
				replaceJQ.each(window.finalApps, function (i, val) {
				if (apps.split(',').indexOf(val.androidPackage) != -1) {
							indexes.push(i);
					}
				});
				for (var i = indexes.length - 1; i >= 0; i--) {
					window.finalApps.splice(indexes[i], 1);
				}
			}
			window.finalApps.slice(0,1).forEach(function (val1, key1) {
			if (val1){
				document.querySelectorAll('.js-modal_title').forEach(function(element, index){
						element.setAttributes({
							html: title
						});
				});
				for (var i = 0, jsAppUrl = document.querySelectorAll('.js_app_url'), l = jsAppUrl.length; i < l; i++) {
					jsAppUrl[i].setAttributes({
						'data-jsonid': key1
					});
				};
				document.querySelectorAll('.js-modal_main_img_itm').forEach(function(element, index){
					element.setAttributes({
						src:    val1.urlImg,
						onload: document.querySelector('.js-modal_inner_cust').style.display = "",
						alt:    val1.title
					});
				});

				document.querySelector('.js-modal_itm_info_title').setAttributes({
					html: val1.title.substring(0, 25)
				});

				document.querySelector('.js-modal_itm_info_text').setAttributes({
					html: val1.desc.substring(0, 90)
				});
				document.querySelector('.js-modal_itm_info_btn').setAttributes({
					html: btitle,
					styles: {
						background: '#'+bcolor
					}
				});

				var jsAppUrl = document.querySelectorAll('.js_app_url');
				for (var i = 0, l = jsAppUrl.length; i < l; i++) {
						jsAppUrl[i].addEventListener('click', function(e) {
								e.preventDefault();
								var keyApp = this.getAttribute('data-jsonid');
								window.location = 'appnext://app:' + JSON.stringify(window.finalApps[keyApp]);		
					});
				};
			}
		});
		
		get_ready();
	};

	function get_ready (argument) {
		var app = window.finalApps[0],
				url = app.pixelImp;

		if (app.pixelImp) {
			return window.location = 'appnext://ready:'+JSON.stringify({pixelImp:url});
		}

		return window.location = 'appnext://ready';
	}

	function init() {
		if (!id) {
			return
		};
		scriptRequest("https://admin.appnext.com/offerWallApi.aspx?pimp=1&ext=t&id="+id+"&cnt="+cnt+"&cat="+cat+"&device="+device+"&d="+d+"&vid="+vid+"&pbk="+pbk, success_jsonp, fail_jsonp);
		var innerCust  = document.querySelectorAll('.js-modal_inner_cust')[0],
				skipButton = document.querySelectorAll('.js-modal_itm_info_foot_btn');
		innerCust.style.backgroundColor = "#"+bgc;
		skipButton.forEach(function(val, key) {
			val.addEventListener('click', function(e) {
				e.preventDefault();
				window.location = 'appnext://close_appwall';
			});
		})

		window.installedApps = installedApps;
		window.dd = 'installedApps';
	}

	return {
		init: init
	}

}());

replaceJQ.ready(function() {
	appnextAPP.init();
});