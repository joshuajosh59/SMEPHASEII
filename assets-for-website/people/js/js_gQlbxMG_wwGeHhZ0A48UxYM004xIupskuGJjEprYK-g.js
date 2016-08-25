/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-flexbox-cssgradients-cssclasses-testprop-testallprops-prefixes-domprefixes-css_boxsizing
 */
;window.Modernizr=function(a,b,c){function y(a){j.cssText=a}function z(a,b){return y(m.join(a+";")+(b||""))}function A(a,b){return typeof a===b}function B(a,b){return!!~(""+a).indexOf(b)}function C(a,b){for(var d in a){var e=a[d];if(!B(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function D(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:A(f,"function")?f.bind(d||b):f}return!1}function E(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return A(b,"string")||A(b,"undefined")?C(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),D(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w={}.hasOwnProperty,x;!A(w,"undefined")&&!A(w.call,"undefined")?x=function(a,b){return w.call(a,b)}:x=function(a,b){return b in a&&A(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.flexbox=function(){return E("flexWrap")},q.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return y((a+"-webkit- ".split(" ").join(b+a)+m.join(c+a)).slice(0,-a.length)),B(j.backgroundImage,"gradient")};for(var F in q)x(q,F)&&(v=F.toLowerCase(),e[v]=q[F](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)x(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},y(""),i=k=null,e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return C([a])},e.testAllProps=E,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document),Modernizr.addTest("boxsizing",function(){return Modernizr.testAllProps("boxSizing")&&(document.documentMode===undefined||document.documentMode>7)});;
(function($, w) {
	
	var Spinner = function() {
		var container_cache;
		this.getInstance = function(opts) {
			if(container_cache) {
				return container_cache;
			}
			
			opts = $.extend({
				lines: 13, // The number of lines to draw
				length: 7, // The length of each line
				width: 4, // The line thickness
				radius: 10, // The radius of the inner circle
				corners: 1, // Corner roundness (0..1)
				rotate: 0, // The rotation offset
				color: '#534F55', // #rgb or #rrggbb
				speed: 1.2, // Rounds per second
				trail: 50, // Afterglow percentage
				shadow: false, // Whether to render a shadow
				hwaccel: false, // Whether to use hardware acceleration
				className: 'spinner', // The CSS class to assign to the spinner
				zIndex: 2e9, // The z-index (defaults to 2000000000)
				top: 'auto', // Top position relative to parent in px
				left: 'auto' // Left position relative to parent in px
			  }, opts);
		  
			var holder = $('<div id="spinner" />').appendTo('body');
		  
			(new window.Spinner(opts)).spin(holder.get(0));
			
			return holder;
		};
	};
	
	/**
	 * Lazy loader class
	 * 
	 * @author Brian Coit <brian.coit@blonde.net>
	 * 
	 * @class
	 * @param 
	 */
	window.LazyLoader = function(container, options) {
		
		this.$container = $(container);

		var $w = $(w);
		var $d = $(document);
		var instance = this;
		
		// attach to element for convenience
		// jQuery should work around circular references internally
		this.$container.data({
			lazyLoader: instance
		});
		
		// set initial states
		this.preventLoad = false;
		this.enabled = true;
		
		// temp flag for when no more items available from solr - gets reset when the filter state changes
		this.noMoreItems = false;

		// default options
		this.options = $.extend({
			sensitivity: 300,
			itemSelector: '.block',
			url: '/',
			updateCallback: $.noop,
			validFilters: [
				'',
				'case_study',
				'article',
        'blog',
        'work'
			]
		}, options);
		
		/**
		 * Gets the difference after scroll
		 * 
		 * @return integer
		 */
		this.getHeightDiff = function() {
			return $d.height() - ($w.height() + $w.scrollTop());
		};
		
		/**
		 * Get the visible items on page
		 * 
		 * @param {string} selector optional
		 * @return jQuery object containing element collection
		 */
		this.getVisibleItems = function(selector) {
			selector = selector || this.options.itemSelector;
      return instance.$container.find(selector);
		};
		
		/**
		 * jQuery.post facade
		 */
		this.loadContent = function(params, callback) {
			params = params || {};
			callback = callback || $.noop;
			
			$.post(this.options.url, params, callback);
		};
		
		/**
		 * Filtering class
		 */
		var FilterManager = function() {
			
			var all = $();
			var currentFilter = '';
			
			var FILTER_COOKIE_KEY = 'last_filter';
			
			this.apply = function(type, callback) {
				callback = callback || $.noop;
				
				// if filter is already applied, then skip 
				if(currentFilter != '') {
					return false;
				}
				
				// skip disallowed filters
				if($.inArray(type, instance.options.validFilters) === -1) {
					return false;
				}
				
				var originalPath = document.location.pathname;
				
				instance.preventLoad = true;
				
				instance.loadContent({
					type: type
				}, function(data) {
					
					// if no data returned, then temporarily disable loading
					if(!data) {
						instance.noMoreItems = true;
					}
					
					currentFilter = type;
					
					(function() {
						var itemsToRemove = instance.getVisibleItems();
					
						itemsToRemove.each(function() {
							all = all.add(this);
						});
						
						var keep;
						instance.getVisibleItems().each(function() {
							if($(this).find('a[href="/"]').length) {
								keep = $(this);
							}
						});
						
						itemsToRemove = itemsToRemove.not(keep);
						itemsToRemove.remove();
					}());
					

					instance.$container.append(data);
					callback(data);
					instance.options.updateCallback(instance);
					instance.preventLoad = false;
					$.cookie(FILTER_COOKIE_KEY, type, {path: '/'});
				});
				
				return true;
			};
			
			this.reset = function() {
				
				instance.noMoreItems = false;
				
				// no reset if already in initial state
				if(currentFilter === '') {
					return;
				}
				
				instance.$container.empty();
				instance.$container.append(all);
				
				currentFilter = '';
				
				$.cookie(FILTER_COOKIE_KEY, null, {path: '/'});
				instance.options.updateCallback(instance);
			};
			
			this.getCurrentFilterTerm = function() {
				return currentFilter;
			};
		};
		
		this.filter = new FilterManager();
		
		this.loadSet = function() {
			// prevent loading more until complete
			this.preventLoad = true;

			items = instance.getVisibleItems();

			if(instance.noMoreItems) {
				instance.preventLoad = false;
				return;
			}

			// only create block if required
			if(typeof spinner_block === 'undefined') {
				spinner_block = items.filter(':first').clone();
				(function() {
					spinner_block.empty().attr('class', 'block loading-block');
					spinner_block.removeAttr('data-initial-position').removeAttr('data-mobile-weight');
					spinner_block.append((new Spinner).getInstance());
				}());
			}
			spinner_block.appendTo(instance.$container)

			var visibleItemCount = items.length;
			var top = $w.scrollTop();

			$w.scrollTop(spinner_block.offset().top);

			this.loadContent({ 
				start: visibleItemCount,
				type: instance.filter.getCurrentFilterTerm()
			}, function(data) {


				if(data) {
					instance.$container.append(data);
				} else {
					instance.noMoreItems = true;
				}

				instance.options.updateCallback(instance);
				$w.scrollTop(top);
				spinner_block.detach();
				instance.preventLoad = false;

			});
		};
		
		var spinner_block;
		
		/**
		 * Private scroll event handler
		 * 
		 * @private
		 * @return void
		 */
		var scroll = function(e) {
			var diff = this.getHeightDiff();
			
			if(diff < this.options.sensitivity && this.enabled && !this.preventLoad) {
				instance.loadSet();
			}
		};
		
		// bind scroll event handler
		$w.on('scroll', function(e) {
			scroll.apply(instance, [e]);
		});
	};
}(jQuery, window));;
//fgnass.github.com/spin.js#v1.2.7
!function(e,t,n){function o(e,n){var r=t.createElement(e||"div"),i;for(i in n)r[i]=n[i];return r}function u(e){for(var t=1,n=arguments.length;t<n;t++)e.appendChild(arguments[t]);return e}function f(e,t,n,r){var o=["opacity",t,~~(e*100),n,r].join("-"),u=.01+n/r*100,f=Math.max(1-(1-e)/t*(100-u),e),l=s.substring(0,s.indexOf("Animation")).toLowerCase(),c=l&&"-"+l+"-"||"";return i[o]||(a.insertRule("@"+c+"keyframes "+o+"{"+"0%{opacity:"+f+"}"+u+"%{opacity:"+e+"}"+(u+.01)+"%{opacity:1}"+(u+t)%100+"%{opacity:"+e+"}"+"100%{opacity:"+f+"}"+"}",a.cssRules.length),i[o]=1),o}function l(e,t){var i=e.style,s,o;if(i[t]!==n)return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(o=0;o<r.length;o++){s=r[o]+t;if(i[s]!==n)return s}}function c(e,t){for(var n in t)e.style[l(e,n)||n]=t[n];return e}function h(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var i in r)e[i]===n&&(e[i]=r[i])}return e}function p(e){var t={x:e.offsetLeft,y:e.offsetTop};while(e=e.offsetParent)t.x+=e.offsetLeft,t.y+=e.offsetTop;return t}var r=["webkit","Moz","ms","O"],i={},s,a=function(){var e=o("style",{type:"text/css"});return u(t.getElementsByTagName("head")[0],e),e.sheet||e.styleSheet}(),d={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto",position:"relative"},v=function m(e){if(!this.spin)return new m(e);this.opts=h(e||{},m.defaults,d)};v.defaults={},h(v.prototype,{spin:function(e){this.stop();var t=this,n=t.opts,r=t.el=c(o(0,{className:n.className}),{position:n.position,width:0,zIndex:n.zIndex}),i=n.radius+n.length+n.width,u,a;e&&(e.insertBefore(r,e.firstChild||null),a=p(e),u=p(r),c(r,{left:(n.left=="auto"?a.x-u.x+(e.offsetWidth>>1):parseInt(n.left,10)+i)+"px",top:(n.top=="auto"?a.y-u.y+(e.offsetHeight>>1):parseInt(n.top,10)+i)+"px"})),r.setAttribute("aria-role","progressbar"),t.lines(r,t.opts);if(!s){var f=0,l=n.fps,h=l/n.speed,d=(1-n.opacity)/(h*n.trail/100),v=h/n.lines;(function m(){f++;for(var e=n.lines;e;e--){var i=Math.max(1-(f+e*v)%h*d,n.opacity);t.opacity(r,n.lines-e,i,n)}t.timeout=t.el&&setTimeout(m,~~(1e3/l))})()}return t},stop:function(){var e=this.el;return e&&(clearTimeout(this.timeout),e.parentNode&&e.parentNode.removeChild(e),this.el=n),this},lines:function(e,t){function i(e,r){return c(o(),{position:"absolute",width:t.length+t.width+"px",height:t.width+"px",background:e,boxShadow:r,transformOrigin:"left",transform:"rotate("+~~(360/t.lines*n+t.rotate)+"deg) translate("+t.radius+"px"+",0)",borderRadius:(t.corners*t.width>>1)+"px"})}var n=0,r;for(;n<t.lines;n++)r=c(o(),{position:"absolute",top:1+~(t.width/2)+"px",transform:t.hwaccel?"translate3d(0,0,0)":"",opacity:t.opacity,animation:s&&f(t.opacity,t.trail,n,t.lines)+" "+1/t.speed+"s linear infinite"}),t.shadow&&u(r,c(i("#000","0 0 4px #000"),{top:"2px"})),u(e,u(r,i(t.color,"0 0 1px rgba(0,0,0,.1)")));return e},opacity:function(e,t,n){t<e.childNodes.length&&(e.childNodes[t].style.opacity=n)}}),function(){function e(e,t){return o("<"+e+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',t)}var t=c(o("group"),{behavior:"url(#default#VML)"});!l(t,"transform")&&t.adj?(a.addRule(".spin-vml","behavior:url(#default#VML)"),v.prototype.lines=function(t,n){function s(){return c(e("group",{coordsize:i+" "+i,coordorigin:-r+" "+ -r}),{width:i,height:i})}function l(t,i,o){u(a,u(c(s(),{rotation:360/n.lines*t+"deg",left:~~i}),u(c(e("roundrect",{arcsize:n.corners}),{width:r,height:n.width,left:n.radius,top:-n.width>>1,filter:o}),e("fill",{color:n.color,opacity:n.opacity}),e("stroke",{opacity:0}))))}var r=n.length+n.width,i=2*r,o=-(n.width+n.length)*2+"px",a=c(s(),{position:"absolute",top:o,left:o}),f;if(n.shadow)for(f=1;f<=n.lines;f++)l(f,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(f=1;f<=n.lines;f++)l(f);return u(t,a)},v.prototype.opacity=function(e,t,n,r){var i=e.firstChild;r=r.shadow&&r.lines||0,i&&t+r<i.childNodes.length&&(i=i.childNodes[t+r],i=i&&i.firstChild,i=i&&i.firstChild,i&&(i.opacity=n))}):s=l(t,"animation")}(),typeof define=="function"&&define.amd?define(function(){return v}):e.Spinner=v}(window,document);;
(function($, w) {
	
	window.AjaxHistory = function(options) {
		
		options = $.extend({
			callback: $.noop
		}, options);
		
		var instance = this;
		
		// init
		var History = window.History;
		
		if(typeof History == 'undefined') {
			throw new Error('History polyfill required.');
		}
		
		// skip if in HTML4 browser with no support
		if(!History.enabled) return;
		
		History.Adapter.bind(window, 'statechange', function() {
			var State = History.getState();
			options.callback.apply(this, [State]);
		});
		
		this.getHistory = function() {
			return History;
		};
		
		this.add = function(data, title, url) {
			data = data || {};
			
			return History.pushState(data, title, url);
		};
	};
	
}(jQuery, window));;
(function($)
{
    $.fn.removeStyle = function(style)
    {
        var search = new RegExp(style + '[^;]+;?', 'g');

        return this.each(function()
        {
            $(this).attr('style', function(i, style)
            {
				if(!style) return;
				
                return style.replace(search, '');
            });
        });
    };
}(jQuery));

(function($) {
	
	var STATIC_COLUMN_WIDTH = 240;
	
	// create noop'd console methods if required
	(function() {
		var consoleMethods = [ 'log', 'warn', 'error', 'debug' ];
		
		if(!window.console) {
			window.console = {};
		}
		
		var console = window.console;
		
		for(var i in consoleMethods) {
			var method = consoleMethods[i];
			if(typeof console[method] !== 'function') {
				console[method] = $.noop;
			}
		}
	}());
	
	/**
	 * 
	 */
	function toggleAdminMenu() {
		var FIRST_CLASSNAME = 'first';
		var adminSwitch = $('#admin-switch');
		var height = adminSwitch.parent().height();
		
		$('.admin-area').hide()
			.css('top', -height)
			.show();
	
		var toolbar = $('ul#toolbar-menu');
		var menuItem = $('<li><a id="admin-switch" class="closed">' + $('#admin-switch').html() + '</a></li>');
		toolbar.prepend(menuItem);

		adminSwitch.remove().live('mouseup touchend', function() {
			if(!($(this).hasClass('closed'))) {
				$('.admin-area').animate({
					'top': -height
				});
				$(this).addClass('closed');
				return false;
			} else {
				$('.admin-area').animate({
					'top': 30
				});
				$(this).removeClass('closed');
				return false;
			}
		});
	}
	
	$(document).on('ready', function() {
		if($('#admin-switch').length > 0) {
			toggleAdminMenu();
		}
	});
	
	$(document).on('ready', function() {
		
		var loader;
		
		var gridCallback = function() {
			if(grid !== null) {
				grid.update();
				grid.resize();
			}
		};
		
		var resizeCallback = function() {
//			if(loader.$container.height() <= $(window).height()) {
//				loader.loadSet();
//			}
		};
		
		// set up grid
		var grid = Modernizr.cssgradients
			? new FlexibleGrid('body', {
				holder: '#isotope-container',
				items: '> .block',
				resizeCallback: $('#isotope-container').length ? resizeCallback : $.noop
			}) : null;
			
		// store initial positions
		(function() {
			if(grid) {
				grid.update();
				grid.items.each(function() {
					var block = $(this);
					// $.data() not applying properly :(
					block.attr({ 
						'data-initial-position': block.index() 
					});
				});
			}
		}());

		/**
		* Initialize lazyloader
		*/
		$('#isotope-container').each(function() {
			var $container = $(this);
			
			loader = new LazyLoader(this, {
				url: Drupal.settings.basePath + 'solr_play_load_filter',
				updateCallback: gridCallback
			});
			
			resizeCallback();
			
			// check if there's a fixed filter element
			var filter = $container.data('fixed-filter');
			var filterIsFixed = !!filter;
			
			if(!filter) {
				// remove cookie if we've hit the homepage directly
				if(document.location.pathname === '/') {
					$.cookie('last_filter', null, {path: '/'}); 
				}
					
				filter = $.cookie('last_filter');
			}
			
			if(filter) {
				loader.filter.apply(filter);
			}
			
			var urlFilterMap = {};
			
			var history = window.AjaxHistory 
				? new window.AjaxHistory({
					callback: function(data) {
						// at the moment, there can only be one possible back state, so we assume a reset
						loader.filter.reset();
					}
				})
				: undefined;

			$container.on('click', '.block[class*="filter-"]', function(e) {
				e.preventDefault();

				var trigger = $(this);
				var triggerIdx = $(this).index();
				var anc = $(this).find('> a[href]');
				
				var className = $(this).attr('class');
				var filterType = className.replace(new RegExp('^(.*)filter-([^ $]+)([ ]*)(.*)$'),'$2');
        
       
        
				// we've arrived on a page with a fixed filter (via a hard link) - follow hard link back home...
				if(filterIsFixed) {
					var href = anc.attr('href');
					if(href === '/') {
						window.location.href = href;
						return;
					}
				}
				
				history.add({filter: filterType}, document.title, anc.attr('href'));
				

				if(filterType !== loader.filter.getCurrentFilterTerm()) {
					setToggleStateIcon(trigger, true);

					var filtered = loader.filter.apply(filterType, function(data) {
						trigger.addClass('block-active');
						trigger.addClass('filtered');
						$('body').addClass('not-front');
						
						if(grid) {
							grid.update();
							grid.resize();
						}
						
						trigger.insertBefore(loader.getVisibleItems().get(triggerIdx));
					});
					
					// if filter didn't apply (probably because it's not a valid filter), redirect to the href value
					if(!filtered) {
						window.location.href = anc.attr('href');
					}
					
				} else {
					history.getHistory().back();
					setToggleStateIcon(trigger, false);
					trigger.removeClass('block-active');
					trigger.removeClass('filtered');
					$('body').removeClass('not-front');
					gridCallback();
				}
			});
			
			function setToggleStateIcon($block, active) {
				active = !!active;
				var $el = $block.find('.minusicon, .plusicon');
				
				if(active) {
					$el.removeClass('plusicon').addClass('minusicon');
				} else {
					$el.removeClass('minusicon').addClass('plusicon');
				}
			}
		});
	});
	
	// reset cookie if not jumping directly to another work page
	$(document).on('ready', function() {
		if(!$('.case_study_gallery_switcher').length) {
			jQuery.cookie('gallery_view', '0', {path: '/'});
		}
	});
	
	$(document).on('ready', function() {
		var savedStates = window.History.storedStates;
		
		if(savedStates && savedStates.length > 1) {
			$('a[href="/"]').on('click', function(e) {
				e.preventDefault();
				window.History.back();
			});
		}
	});

	$(document).on('ready', function() {
		// if page hit directly and there's a fixed filter, update aggregator +/-
		var container = $('#isotope-container');
		var filter = container.data('fixed-filter');
		if(filter) {
			container.find('.aggregator .plusicon')
				.removeClass('plusicon')
				.addClass('minusicon');
		}
	});

	// init google maps, create markers etc
	$(window).on({
		ready: function() {

			var createStyle = function(stylesObj) {
				return new google.maps.StyledMapType(stylesObj, {
					name: 'Blonde'
				});
			};

			$('.map-holder').each(function() {
				var container = $(this);

				// get data attributes from map container element and parse to object
				var overlayData = $(this).data('map-overlay');
				var overlayDataObj = $.parseJSON(overlayData);

				var lat = overlayData['lat'];
				var lng = overlayData['lng'];
				var title = overlayData['title'];
				var content = overlayData['content'];

				var instance = new BlondeMap(this, {
					lat: lat,
					lng: lng,
					center: new google.maps.LatLng(lat, lng),
					mapTypeControlOptions: {
						mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'Blonde']
					},
					// custom styler option
					styler: createStyle([
						{
							"stylers": [
								{ "hue": "#c3ff00" },
								{ "gamma": 0.73 },
								{ "lightness": 17 },
								{ "saturation": -61 }
							]
						}
					])
				});

				// create markers
				var icon = new google.maps.MarkerImage(
					'/sites/all/themes/blonde/images/map/image.png',
					new google.maps.Size(16,25),
					new google.maps.Point(0,0),
					new google.maps.Point(8,25)
				);

				var shadow = new google.maps.MarkerImage(
					'/sites/all/themes/blonde/images/map/shadow-below.png',
					new google.maps.Size(29,20),
					new google.maps.Point(0,0),
					new google.maps.Point(15,9)
				);

				var shape = {
					coord: [10,0,12,1,13,2,14,3,15,4,15,5,15,6,15,7,15,8,15,9,15,10,15,11,15,12,15,13,14,14,14,15,13,16,13,17,12,18,12,19,11,20,10,21,10,22,9,23,8,24,7,24,6,23,5,22,5,21,4,20,4,19,3,18,2,17,2,16,1,15,1,14,1,13,0,12,0,11,0,10,0,9,0,8,0,7,0,6,0,5,0,4,1,3,2,2,3,1,5,0,10,0],
					type: 'poly'
				};
				
				var showOverlay = false;

				var marker = instance.createAndAddMarker(lat, lng, {
					draggable: false,
					icon: icon,
					shadow: shadow,
					shape: shape,
					cursor: showOverlay ? 'pointer' : 'drag'
				});
				
				// add infowindow for each map
				if(showOverlay) {
				
					var infowindow = instance.createOverlay(title, content);
					var togglewindow = function() {
						infowindow.open(instance.map, marker);
					};
					google.maps.event.addListener(marker, 'click', togglewindow);
				}
			});
		}
	});
	
	var supportsPointerEvents = function() {
		var element = document.createElement('x'),
			documentElement = document.documentElement,
			getComputedStyle = window.getComputedStyle,
			supports;
		if(!('pointerEvents' in element.style)){
			return false;
		}
		element.style.pointerEvents = 'auto';
		element.style.pointerEvents = 'x';
		documentElement.appendChild(element);
		supports = getComputedStyle && getComputedStyle(element, '').pointerEvents === 'auto';
		documentElement.removeChild(element);
		return !!supports;
	};
	
	$(document).on('ready', function() {
		if(supportsPointerEvents()) {
			$('body').addClass('pointerevents');
			
			$('select#edit-submitted-area-of-interest')
				.wrap('<div class="styled-select" />')
				.wrap('<div class="styled-select-inner" />');
		}
	});
	
	$(document).on('ready', function() {
		var inputs = $('#block-blonde-solr-service-search input, .webform-client-form input');
		
		inputs.each(function() {
			var input = $(this);
			var form = inputs.closest('form');
			var placeholder = input.attr('placeholder');
			var defaultValue = placeholder ? placeholder : 'Type here...';
			
			input.removeAttr('placeholder');

			input.on({
				focus: function() {
					if(input.val() === defaultValue) {
						input.val('');
					}
				},
				blur: function() {
					if(input.val() === '') {
						input.val(defaultValue);
					}
				}
			});

			form.on({
				submit: function() {
					if(input.val() === defaultValue) {
						input.val('');
					} 
				}
			});
		});
	});
	
	// handle width fitting of blocks on mobile
	$(document).on('ready', function() {
		var sidebars = $('.sidebar');
		var blocks = $('.block', sidebars);
		var scale = false;
		
		var calculateSize = function() {
			if(scale) {
				var w = blocks.outerWidth();
				blocks.css('height', w);
			} else {
				blocks.removeStyle('height');
			}
		};
		
		var toggleClass = function() {
			if($(window).width() < 640) {
				$('body').addClass('scale-blocks');
				scale = true;
			} else {
				$('body').removeClass('scale-blocks');
				scale = false;
			}
			calculateSize();
		};
		
		toggleClass();
		
		$(window).on({
			resize: toggleClass
		});
		
	});
	
	// wrap all content images ready for dropshadow
	$(document).on('ready', function() {
		$('article img').not('.basic').each(function() {
			var img = $(this);
			var wrap = $('<span class="image-shadow" />');
			wrap.insertBefore(img);
			wrap.append(img);
		});
	});
	
	// content height recalc
	(function() {
		var resize = function() {
			var w = $(window);
			var container = $('#content');

			container.css({ minHeight: 0 });

			if(w.width() > 640) {
				container.css({
					minHeight: $(document).height() - parseInt(container.css('margin-top')) - $('#footer').outerHeight() -150
				});
			}
		};
		
		$(window).on({ resize: resize, load: resize });
		
	}());
        
        // add wrapper to h2 on people biogs
        $(document).on('ready', function() {
		$('.section-profile .profile h2').each(function() {
			var $h2 = $(this);
			$h2.wrap('<div class="title-wrapper" />');
			
		});
	});
	
	
}(jQuery));;
/**
 * Google maps wrapper
 * 
 * @author Brian Coit <brian.coit@blonde.net>
 */
(function($) {
	
	window.BlondeMap = function(el, options) {
		
		if(typeof google.maps === 'undefined')
			throw 'Google maps API not loaded. Unable to create blonde map instance.';

		var createMap = function($el, options) {
			options = $.extend(true, {
			  zoom: 16,
			  center: new google.maps.LatLng(55.960167732466, -3.1799840927124023),
			  mapTypeId: google.maps.MapTypeId.ROADMAP,
			  scaleControl: false,
			  mapTypeControl: false,
			  overviewMapControl: false,
			  panControl: false,
			  rotateControl: false,
			  streetViewControl: false,
				  zoomControl: false
			}, options);
			
			return new google.maps.Map($el.get(0), options);
		};

		this.create = function(el, options) {
			this.container = $(el);
			
			if(!this.container.length) {
				console.warn('BlondeMap::create() expects a valid DOM element / jQuery element / css selector. Got "' + String(el) + '". Skipping.');
				return;
			}
			
			this._options = $.extend({
				lat: null,
				lng: null
			}, options);

			if(!this._options.lat || !this._options.lng) {
				console.warn('BlondeMap::create() expects lat/lng options to be passed.');
				return;
			}

			this.map = createMap($(el), this._options);
			
			if(options.styler) {
				this.map.mapTypes.set('Blonde', options.styler);
				this.map.setMapTypeId('Blonde');
			}
		};
		
		this.addMarker = function(markerInstance) {
			markerInstance.setMap(this.map);
		};
		
		this.createAndAddMarker = function(lat, lng, options) {
			var marker = this.createMarker(lat, lng, options);
			this.addMarker(marker);
			return marker;
		};

		/**
		 * Creates a marker (without adding it to the map)
		 *
		 * @var {integer} lat Latitude
		 * @var {integer} lng Longitude
		 * @var {object} options google.maps.Marker options object
		 */
		this.createMarker = function(lat, lng, options) {
			var map = this.map;
			var latLng = new google.maps.LatLng(lat, lng);
			options = $.extend({
				position: latLng,
				map: map
			}, options);
			return new google.maps.Marker(options);
		};
		
		this.createOverlay = function(title, content) {
			var infowindow = new google.maps.InfoWindow();
			var innerContent = '<h2>' + title + '</h2>' + content;
			
			infowindow.setContent(innerContent);
			return infowindow;
		}

		this.onResize = function() {
			google.maps.event.trigger(this.map, 'resize');
		};
		
		this.create(el, options);
	};
	
}(jQuery));;
(function($) {
	
	/**
	 * Takes a collection of blocks and sets them to best-fit grid
	 * 
	 * @author Brian Coit <brian.coit@blonde.net>
	 */
	
	window.FlexibleGrid = function(el, options) {
		this.options = $.extend({
			min: 240,
			max: 300,
			holder: '#grid',
			items: '> .item',
			enabled: true,
			resizeCallback: $.noop
		}, options);
	
		var grid = this;
		var $container = $(el);
		
		grid.gridHolder = $(grid.options.holder);
		
		$container.data('flexible-grid', this);
		
		var init = function() {
			grid.update();
			
			// get initial tile size
//			grid.initialSize = grid.items.filter(':first-child').width();
			grid.initialSize = 240; // hardcoded to prevent media queries messing with the initialSize value
			
			grid.resize();
		};
		
		this.update = function() {
			grid.items = grid.gridHolder.find(grid.options.items);
			return grid.items;
		};
	
		var updateHeight = function(size) {
			grid.items.css({ height: size });
			grid.items.find('> .inner').css({ height: size });
		};
		var updateWidth = function(size) {
			grid.items.css({ width: size });
//			grid.items.find('> .inner').css({ width: size });
		};
		var updateDimensions = function(width, height) {
			height = height || width; // assume square if no height passed
			updateWidth(width);
			updateHeight(height);
		};
		var updateHeadingWidth = function(size) {
			// set h2 inner span width - required for long non-breaking titles to be truncated using css
			size = size - parseInt(grid.items.css('padding-left')) - parseInt(grid.items.css('padding-right'));
			
			// get standard block headings (skip aggregators since they apply different styling)
			var heading = grid.items.find('h2:not(.aggregator h2)');
			size-= parseInt(heading.css('padding-left')) + parseInt(heading.css('padding-right'));
			
			var span = $(' > span', heading);
			span.css({ maxWidth: size });
		};
		var updateContainerGrid = function(width, height, units) {
			units = units || 'px';
			$container.css({
				backgroundSize: width + units + ' ' + height + units + ', ' + width + units + ' ' + height + units
			});
		};
		
		this.resize = function() {

			var holder = grid.gridHolder;
			
			if(grid.gridHolder.length) {
				$('#main').css({overflow: 'hidden'});
			}
			
			// update height only for mobile version
			// swap for Modernizr.mq() if we require anything more complicated
			if($(window).width() < 640) {
				holder.css('width', '100%');

				grid.items.css('width', '50%');
				var w = grid.items.width();

				updateHeight(w);
				updateHeadingWidth(w);
				
				grid.options.resizeCallback.apply(this, []);
				return;	
			}
			
			holder.width('auto');
			
			var holderWidth = holder.outerWidth() + parseInt(holder.css('margin-left')) + parseInt(holder.css('margin-right'));
			var numPerRow = Math.floor(holderWidth / grid.initialSize);
			var newWidth = holderWidth / numPerRow; // may need to floor this for some browsers
			var newHeight = Math.floor(newWidth);
			
			
			
			
			// try calculating %age width
			var percentage = newWidth / $container.width() * 100;
			
			var absoluteWidth = $(window).width() / 100 * percentage;
			absoluteWidth = Math.ceil(absoluteWidth);
			
			// set block dimensions
			updateDimensions(absoluteWidth, newHeight);
			updateHeadingWidth(absoluteWidth);
			
			// set the css gradient background width/height
			updateContainerGrid(absoluteWidth, newHeight, 'px');

			holder.width(holder.width() + 20);
			
			grid.options.resizeCallback.apply(this, []);
		};
		
		// execute on load
//		this.update();
		
		$(window).on({
			'ready': init,
			'resize': grid.resize
//			'orientationchange': grid.resize
		});
	};
	
}(jQuery));;
