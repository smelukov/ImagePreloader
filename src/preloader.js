/**
 * @author Sergey Melyukov
 */

/**
 * Image preloader
 *
 * @class ImagePreloader
 * @constructor
 *
 * @param {String|HTMLImageElement=} failImage
 * @param {function({status:boolean, value:HTMLImageElement})=} onProgress
 */
var ImagePreloader = function(failImage, onProgress) {
    /**
     * @type {?function({status: boolean, value: HTMLImageElement})}
     */
    this.onProgress = onProgress;
    /**
     * @type {?String|HTMLImageElement}
     */
    this.failImage = failImage;
};

/**
 * Do simple image preload.
 * Returned promise will be resolved/rejected with HTMLImageElement
 *
 * @return {Promise}
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
        } else if (typeof imageSource === 'string' || imageSource instanceof String) {
            img = new Image();
            img.onload = resolve.bind(null, img);
            img.onerror = reject.bind(null, img);
            img.src = imageSource;
        }
    });
};

/**
 * Preload image.
 *
 * If failImage-property is defined, then src-attribute for broken images will replaced by failImage
 * If onProgress-method is defined, then this method will be calling for every image loading (fulfilled of rejected).
 *
 * Returned promise will be resolved with Array<{status:boolean, value:HTMLImageElement}>
 *
 * @return {Promise}
 */
ImagePreloader.prototype.preload = function() {
    var that = this,
        imagesToLoad = Array.prototype.concat.apply([], Array.prototype.slice.call(arguments));

    imagesToLoad = imagesToLoad.map(function(imageSource) {
        return ImagePreloader.simplePreload(imageSource).catch(function(failImage) {
            if (that.failImage) {
                failImage.setAttribute('fail-src', failImage.src);
                failImage.src = that.failImage.src || that.failImage;

                return ImagePreloader.simplePreload(failImage);
            } else {
                return Promise.reject(failImage);
            }
        });
    });

    return Promise.allSettled(imagesToLoad, that.onProgress);
};
