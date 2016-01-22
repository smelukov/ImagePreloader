/**
 * @author Sergey Melyukov
 */

if (typeof Promise !== 'function') {
    throw new Error('Your browser does not support promises')
}

/**
 * Waiting while all promises will be settled to onFulfilled or onRejected state
 * Returned promise will be resolved with array with info for every promise:
 * Array<{status:boolean, value:*}>
 *
 * onProgress-function will be called for every settled promise (if onProgress-function is defined)
 *
 * @param {Array<Promise>} promises
 * @param {function({status:boolean, value:*})=} onProgress
 *
 * @return {Promise}
 */
Promise.allSettled = function(promises, onProgress) {
    promises = promises.map(function(promise) {
        return promise.then(function(value) {
            return {
                value: value,
                status: true
            };
        }, function(e) {
            return {
                value: e,
                status: false
            };
        }).then(function(value) {
            if (onProgress) {
                onProgress(value);
            }

            return value;
        });
    });

    return Promise.all(promises);
};

/**
 * Delay promise
 *
 * @param {number=} milliseconds
 *
 * @return {Promise}
 */
Promise.delay = Promise.prototype.delay = function(ms) {
    ms = ms || 1000;

    if (this instanceof Promise) {
        return this.then(function(value) {
            return Promise.delay(ms).then(function() {
                return value;
            });
        });
    } else {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    }
};
