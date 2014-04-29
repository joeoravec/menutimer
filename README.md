# MenuTimer

A menu timing application. [menutimer.com](http://www.menutimer.com)

Built on top of [ngBoilerplate](http://joshdmiller.github.com/ng-boilerplate).

***


## About MenuTimer

MenuTimer is a sample AngularJS application.

### Purpose

The application was developed to take basic information about the time to make each dish in a menu and show when each should be started to have all dishes ready at the same time. For each dish, the user can enter a prep time, a cook time, a rest time, and a finish time; for example, a cake may require 20 minutes of prep (mixing the ingredients, preheating the oven), 40 minutes cook time, 20 minutes rest (or cooling) time, and 15 minutes finish time to add frosting.

This initial iteration have a few simplicities:

* Although a dish need not have all four of the time types, they can only happen in the order noted: prep, cook, rest, finish. More complex dishes that have intermediate prep stages or multiple cook stages (eg, prep, cook, rest, prep, cook, finish) aren't accommodated.
* The basic assumption is that only prep times can't overlap (ie, you can't peel potatoes for one dish and mix a glaze for the turkey at the same time); however, all items can cook at the same time -- unrealistic for anyone who has ever cooked Thanksgiving dinner and tried to juggle which items fit in the over at the same temperature.
* Currently, dinner time is today at 6pm. This needs to be changed to user selected.
* The application can accept existing values from the querystring via $location; it doesn't yet display the url for the user to copy/save/share.
* Time is entered as minutes.

### Roadmap

* Update ngBoilerplate -- get the latest with update versions of angular, bootstrap, etc.
* User update date/time of dinner
* Make the link with the user's current menu items available to copy/paste, email, etc.
* Add backend storage
* Add menu name
* Display current time, time left to go, etc.




## Quick Start -- from ngBoilerplate

Install Node.js and then:

```sh
$ npm install
$ bower install
$ grunt watch
```

Finally, open `build/index.html` in your browser.

When you're ready to push your app into production, just run the `compile`
command:

```sh
$ grunt compile
```

This will concatenate and minify your sources and place them by default into the
`bin/` directory. There will only be three files: `index.html`,
`your-app-name.js`, and `your-app-name.css`. All of the vendor dependencies like
Bootstrap styles and AngularJS itself have been added to them for super-easy
deploying. If you use any assets (`src/assets/`) then they will be copied to
`bin/` as is.

Lastly, a complete build is always available by simply running the default
task, which runs `build` and then `compile`:

```sh
$ grunt
```
