:lipstick: izakaya-project-develop :lipstick:
===============

<p align="center">
  <img src="https://raw.githubusercontent.com/izakaya-project/izakaya-project-web/master/image.png">
</p>

## Overview

izakaya project develop repository.

## Tools

* ES6
* gulp
* bundler
* browserify
* Sass
* Compass
* React
* CreateJS
* Pixi.js
* Express
* socket.io

## Getting Started

set up the necessary files.

    npm i

and

    bower i

and

    bundle install  --path vendor/bundle

run a gulp

    npm run local

if you want to release build.

    npm run product

Please enter the following URL to launch the browser.

    http://localhost:3000/

heroku buildpacks setup

    heroku buildpacks:set https://github.com/heroku/heroku-buildpack-nodejs

Since heroku can not be confused with Ruby and Node.js, it was to quit to compile during postinstall.

    "postinstall": "bower install && npm run product"

## Port 3000 is unavailable error.

Port 3000 is unavailable.

    lsof -i -P | grep 3000

    kill -9 3000

## Directory Structure

    ├── gulp
    │   └── tasks
    ├── node_modules
    ├── public
    │   ├── images
    │   ├── javascripts
    │   └── stylesheets
    ├── routes
    │   └── express routing modules
    ├── source
    │   ├── javascripts
    │   └── stylesheets
    └── vendor
        └── ruby modules

## express-generator

command to create the express module.

[express-generator](http://expressjs.com/starter/generator.html)

## Postman

Postman is great chrome a addon.

[Postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm/related)


## Author

[hisasann](https://github.com/hisasann)

:arrow_up: enjoy! :arrow_up:
