[![Build Status](https://travis-ci.org/smelukov/ImagePreloader.svg?branch=master)](https://travis-ci.org/smelukov/ImagePreloader)

# ImagePreloader
Simple, fast and lightweight html-images preloader

### How to use it?
```javascript
var preloader = new ImagePreloader();

preloader.preload(urlOrImgElement1, urlOrImgElement2, urlOrImgElement3, ...)
    .then(function(status){
        console.log('all done!', status);
    });
```
In this case, preload promise always will be fulfilled with the status of every image.

Or you can use a simple static method:
```javascript
ImagePreloader.simplePreload(urlOrImgElement)
    .then(function(status){
        console.log('all done!', status);
    }).catch(function() {

    });
```

In this case, preload promise will be fullfilled or rejected. It depends from image loading result.

### What is that?
This is a simple realization of HTML-image preloader that supports CommonJS, AMD and non-module definition.

There are a few cool features:
- promise-based flow
- progress callback support
- fallback image support
- working with either url or dom image element

Promise-based flow allows you to work with result of preloader as with simple promise(than it is in reality).

If onProgress-property will be settled to preloader instance, then preloader will be calling this callback after any image will be loaded(fail or success):
```javascript
var preloader = new ImagePreloader();

preloader.onProgress = function(info) {
    console.log('image with source %s is loaded with status %s', info.value.src, info.status);
};

preloader.preload(urlOrImgElement1, urlOrImgElement2, urlOrImgElement3, ...)
    .then(function(status){
        console.log('all done!', status);
    });
```

As well you can set fallback image, that will be replaced with if original image can not be loaded:
```javascript
var preloader = new ImagePreloader();

preloader.fallbackImage = fallbackImageUrlOrImgElement;

preloader.preload(urlOrImgElement1, urlOrImgElement2, urlOrImgElement3, ...)
    .then(function(status){
        console.log('all done!', status);
    });
```

For more info - read the [docs](docs/README.md) and see the [example](example/)

### Requires
- ES6 Promises

### How to install it?
```shell
npm install image-preloader --save
```
or
```shell
bower install image-preloader --save
```

### How to build it?
```shell
gulp
```
