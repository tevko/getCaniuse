getCaniuse
---------

##What does it do?

It turns Caniuse.com into a plugin that you can use on your website.

##How do I use it?

Make sure that anything you want to display data from caniuse.com is wrapped in ``<get-caniuse></get-caniuse>`` tags. Make sure getcaniuse.min.js is included on your site. That's it.

##Can I see a working demo?

Yes you may. http://codepen.io/tevko/full/OVQeyP

##What browsers does this support?

IE10 and up. For older browsers, the plugin will degrade gracefully by not initializing.

##How will this affect performance on my site?

The full caniuse.com database is really just a large JSON file. It doesn't get loaded on your site until a user intentionally clicks on a ``<get-caniuse>`` element. Weighs 1.9k minified and gzipped