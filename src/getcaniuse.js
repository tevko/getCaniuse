
/* getcaniuse.js
*
* Wrap mentions of web platform features in an html tag, get caniuse data on click
*
* Author: Tim Evko
* https://twitter.com/tevko
* https://timevko.com
* https://github.com/tevko/getCaniue
* License: MIT
*
*/

(function() {
	/*global CIU */
	'use strict';
	window.CIU = {
		settings: {
			elems: 'get-caniuse',
			cIco: 'http://caniuse.com/img/favicon-128.png',
			CIUData: '',
			dataURL: 'https://raw.githubusercontent.com/Fyrd/caniuse/master/data.json',
			objFormatted: false
		},
		init: function() {
			'classList' in document.createElement('_') && this.createLinks();
		},
		createLinks: function() {
			var s = this.settings,
				cElems = document.querySelectorAll(s.elems);
			Array.apply(null, cElems).forEach(function(elem) {
				elem.addEventListener('click', this.getCIUData.bind(elem, elem.innerHTML, s));
				var i = new Image();
				i.src = s.cIco;
				i.style.width = '15px';
				i.style.display = 'inline-block';
				elem.appendChild(i); // we do this last so that our string doesn't have image HTML inside of it
			}.bind(this));
		},
		getCIUData: function(string, s, e) {
			if (!this.classList.contains('caniuse-disabled')) {
				s.CIUData === '' ? CIU.retrieveJSON(string, this) : CIU.getClosestMatch(string, this);
			} else {
				return e;
			}
		},
		retrieveJSON: function(string, elem) {
			var s = this.settings,
				request = new XMLHttpRequest();
			request.open('GET', s.dataURL, true);
			request.onload = function() {
				if (request.status >= 200 && request.status < 400) {
					s.CIUData = JSON.parse(request.responseText).data;
					this.getClosestMatch(string, elem);
				} else {
					this.fallBack(string);
				}
			}.bind(this);
			request.onerror = function() {
				this.fallBack(string);
			}.bind(this);
			request.send();
		},
		fallBack: function(string) {
			window.open('http://caniuse.com/#search=' + string);
		},
		getClosestMatch: function(string, elem) {
			if (elem.querySelector('.caniuse-card') !== null) {
				elem.querySelector('.caniuse-card').style.display = 'block';
				elem.classList.add('caniuse-disabled');
			} else {
				var s = this.settings,
					strFormat = string.replace(/-/g, '').toUpperCase(),
					regexp = new RegExp('\(' + strFormat + '\)'),
					keys = Object.keys(s.CIUData),
					requestedKey;
				if (!s.objFormatted) {
					keys.forEach(function(key) {
						var keyFormatted = key.replace(/-/g, '').toUpperCase();
						s.CIUData[keyFormatted] = s.CIUData[key];
						delete s.CIUData[key];
					});
					s.objFormatted = true;
					keys = Object.keys(s.CIUData);
				}
				keys.forEach(function(key) {
					if (key.match(regexp)) {
						requestedKey = key;
					}
				});
				requestedKey === undefined && this.fallBack(string); //if we never get a match
				this.makeCard(s.CIUData[requestedKey], elem, string);
			}
		},
		makeCard: function(obj, elem, string) {
			var getSupportData = function() {
				var stats = obj.stats,
					checking = [stats.ie, stats.firefox, stats.chrome, stats.safari, stats.opera, stats.edge],
					supported = '';
				stats.ie.name = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/20890/browser-logo-ie.png';
				stats.firefox.name = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/20890/firefox-logo-170-150x150.png';
				stats.chrome.name = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/20890/browser-logo-chrome.png';
				stats.safari.name = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/20890/safari-logo-150x150[1].png';
				stats.opera.name = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/20890/opera-mini-logo-large-for-android.png';
				stats.edge.name = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/20890/Microsoft-Edge-Browser-logo-150x150.png';
				checking.forEach(function(check) {
					Object.keys(check).forEach(function(key) {
						if (supported.indexOf('<img class="CIU_bs_supported" src="' + check.name + '">') === -1 && (check[key] === 'y' || check[key] === 'p' || check[key] === 'a x #2' || check[key] === 'a #1')) {
							supported += '<img class="CIU_bs_supported" src="' + check.name + '">';
						}
					});
				});
				return supported;
			};
			var card = '<div class="caniuse-card">'
			+ '<p class="title">'
			+ obj.title
			+ '</p>'
			+ '<p class="description">'
			+ obj.description
			+ '</p>'
			+ '<a class="speclink" href="' + obj.spec + '">W3C Spec </a>'
			+ '<div class="caniuse-supports">' + getSupportData() + '</div>'
			+ '<a class="speclink" href="http://caniuse.com/#search=' + string + '">See more on CanIUse.com...</a>'
			+ '<span class="caniuse-close">Close</span>'
			+ '</div>';
			elem.innerHTML += card;
			elem.classList.add('caniuse-disabled');
			elem.addEventListener('click', function(e) {
				if (e.target.classList.contains('caniuse-close')) {
					elem.classList.remove('caniuse-disabled');
					elem.querySelector('.caniuse-card').style.display = 'none';
				}
			});
		}
	};

})();

CIU.init();
