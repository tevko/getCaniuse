/* getcaniuse.js
 *
 * Wrap mentions of web platform features in an html tag, get caniuse data on click
 *
 * Author: Tim Evko
 * https://twitter.com/tevko
 * https://timevko.com
 * https://github.com/tevko/getCaniuse
 * License: MIT
 *
 */

(function() {
  /*global CIU */
  'use strict';

  var t = function(string, data) {
    for (var part in data) {
      string = string.replace(new RegExp('{' + part + '}', 'g'), data[part]);
    }
    return string;
  };

  var CIUBaseURL = 'http://caniuse.com/';
  var CIUSearchURL = CIUBaseURL + '#search=';
  var CLASS_PREFIX = 'caniuse-';
  var CLASS_CARD = CLASS_PREFIX + 'card';
  var CLASS_CARD_SELECTOR = '.' + CLASS_CARD;
  var CLASS_DISABLED = CLASS_PREFIX + 'disabled';
  var CLASS_CLOSE = CLASS_PREFIX + 'close';

  window.CIU = {
    settings: {
      elems: '[data-caniuse]',
      cIco: CIUBaseURL + 'img/favicon-128.png',
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
      if (!this.classList.contains(CLASS_DISABLED)) {
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
      window.open(CIUSearchURL + string);
    },

    getClosestMatch: function(string, elem) {
      if (elem.querySelector(CLASS_CARD_SELECTOR) !== null) {
        elem.querySelector(CLASS_CARD_SELECTOR).style.display = 'block';
        elem.classList.add(CLASS_DISABLED);
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
        var stats = obj.stats;
        var checking = [
          stats.ie,
          stats.firefox,
          stats.chrome,
          stats.safari,
          stats.opera,
          stats.edge
        ];
        var supported = '';
        var AWSBaseURL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/20890/';

        stats.ie.name = AWSBaseURL + 'browser-logo-ie.png';
        stats.firefox.name = AWSBaseURL + 'firefox-logo-170-150x150.png';
        stats.chrome.name = AWSBaseURL + 'browser-logo-chrome.png';
        stats.safari.name = AWSBaseURL + 'safari-logo-150x150[1].png';
        stats.opera.name = AWSBaseURL + 'opera-mini-logo-large-for-android.png';
        stats.edge.name = AWSBaseURL + 'Microsoft-Edge-Browser-logo-150x150.png';

        checking.forEach(function(check) {
          Object.keys(check).forEach(function(key) {
            var thisBrowserIcon = t(
              '<img class="CIU_bs_supported" src="{name}">', {
                name: check.name
              }
            );
            var supportsThisBrowser = supported.indexOf(thisBrowserIcon) >= 0;
            var matchesTheseKeys = check[key] === 'y' || check[key] === 'p' || check[key] === 'a x #2' || check[key] === 'a #1';
            if (!supportsThisBrowser && matchesTheseKeys) {
              supported += thisBrowserIcon;
            }
          });
        });
        return supported;
      };

      var cardTemplate = '<div class="{classCard}"><p class="title">{title}</p><p class="description">{description}</p><a class="speclink" href="{speclink}">W3C Spec</a> <div class="caniuse-supports">{supports}</div><a class="speclink" href="{searchURL}{query}">See more on CanIUse.com...</a><span class="{classClose}">Close</span></div>';

      var cardData = {
        classCard: CLASS_CARD,
        classClose: CLASS_CLOSE,
        title: obj.title,
        description: obj.description,
        speclink: obj.spec,
        supports: getSupportData(),
        searchURL: CIUSearchURL,
        query: string
      };
      var card = t(cardTemplate, cardData);

      elem.innerHTML += card;
      elem.classList.add(CLASS_DISABLED);
      elem.addEventListener('click', function(e) {
        if (e.target.classList.contains(CLASS_CLOSE)) {
          elem.classList.remove(CLASS_DISABLED);
          elem.querySelector(CLASS_CARD_SELECTOR).style.display = 'none';
        }
      });
    }
  };

})();
