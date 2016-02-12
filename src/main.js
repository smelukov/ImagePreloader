/**
 * @licence MIT
 * @author Sergey Melyukov
 */

var allSettled = require('promise-ext-settled');

/**
 * Image preloader
 *
 * @class ImagePreloader
 * @constructor
 *
 * @param {(String|HTMLImageElement)=} fallbackImage
 * @param {function({status:boolean, value:HTMLImageElement})=} onProgress
 */
var ImagePreloader = function(fallbackImage, onProgress) {
    /**
     * @type {?function({status: boolean, value: HTMLImageElement})}
     */
    this.onProgress = typeof onProgress === 'function' ? onProgress : null;
    /**
     * @type {?String|HTMLImageElement}
     */
    this.fallbackImage = typeof fallbackImage === 'string' || fallbackImage instanceof HTMLImageElement ? fallbackImage : null;
};

/**
 * Do simple image preloading.
 *
 * @param {!(String|HTMLImageElement)} imageSource
 *
 * @return {Promise} will be resolved/rejected with HTMLImageElement
 */
ImagePreloader.simplePreload = function(imageSource) {
    return new Promise(function(resolve, reject) {
        var img;

        if (imageSource instanceof HTMLImageElement) {
            img = imageSource;

            if (!img.complete) {
                img.onload = resolve.bind(null, img);
                img.onerror = img.onabort = reject.bind(null, img);
            } else if (img.naturalHeight) {
                resolve(img);
            } else {
                reject(img);
            }
        } else if (typeof imageSource === 'string') {
            img = new Image();
            img.onload = resolve.bind(null, img);
            img.onerror = img.onabort = reject.bind(null, img);
            img.src = imageSource;
        }
    });
};

/**
 * Preload image.
 *
 * If fallbackImage-property is defined and correct, then src-attribute for the broken images will replaced by fallbackImage
 * As well, origin image url will be placed to 'data-fail-src' attribute.
 *
 * If onProgress-method is defined, then this method will be calling for every image loading (fulfilled of rejected).
 *
 * @param {...(String|HTMLImageElement|Array<String|HTMLImageElement>)} args
 *
 * @return {Promise} will be resolved with Array<{status:boolean, value:HTMLImageElement}>
 *
 *     status-property - is the status of image loading
 *     status-property will be true if:
 *      - original image loading is ok
 *      - or original image loading is fail but fallback-image loading is ok
 *     status-property will be false if:
 *      - original image loading is fail
 *      - or original image loading is fail and fallback-image loading is fail
 *
 *     value-property - is the image that was loaded
 */
ImagePreloader.prototype.preload = function(args) {
    var that = this,
        imagesToLoad = Array.prototype.concat.apply([], Array.prototype.slice.call(arguments));

    imagesToLoad = imagesToLoad.map(function(imageSource) {
        return ImagePreloader.simplePreload(imageSource).catch(function(brokenImage) {
            if (that.fallbackImage) {
                return ImagePreloader.simplePreload(that.fallbackImage)
                    .then(function(fallbackImage) {
                        brokenImage.setAttribute('data-fail-src', brokenImage.src);
                        brokenImage.src = fallbackImage.src;

                        return brokenImage;
                    }, function() {
                        return Promise.reject(brokenImage);
                    });
            }

            return Promise.reject(brokenImage);
        });
    });

    return allSettled(imagesToLoad, that.onProgress);
};

module.exports = ImagePreloader;
