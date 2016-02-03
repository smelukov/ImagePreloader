var images = [
    'http://dummyimage.com/800x600/000000/fff.jpg',
    'http://dummyimage.com/800x600/000000/f00.jpg',
    'http://dummyimage.com/800x600/000000/0f0.jpg',
    'http://dummyimage.com/800x600/000000/00f.jpg',
    'http://dummyimage.com/800x600/000000/f0f.jpg'
];

define(['image-preloader'], function(ImagePreloader) {
    describe('simple image loading', function() {
        this.timeout(20000);

        it('should loading from url', function(done) {
            ImagePreloader.simplePreload(images[0])
                .then(function() {
                    done();
                }, function() {
                    done(new Error);
                });
        });

        it('should loading from html element', function(done) {
            var image = new Image();

            image.src = images[0];

            ImagePreloader.simplePreload(image)
                .then(function() {
                    done();
                }, function() {
                    done(new Error);
                });
        });

        it('should loading from already loaded html element', function(done) {
            var image = new Image();

            image.src = images[0];

            ImagePreloader.simplePreload(image)
                .then(function() {
                    return ImagePreloader.simplePreload(image);
                })
                .then(function() {
                    done();
                }, function() {
                    done(new Error('image loading has failed'));
                });
        });

        it('should fail loading from string', function(done) {
            ImagePreloader.simplePreload('http://fake/')
                .then(function() {
                    done(new Error());
                }, function() {
                    done();
                });
        });

        it('should fail loading from html element', function(done) {
            var image = new Image();

            image.src = 'http://fake/';

            ImagePreloader.simplePreload(image)
                .then(function() {
                    done(new Error());
                }, function() {
                    done();
                });
        });

        it('should fail loading from already failed html element', function(done) {
            var image = new Image();

            image.src = 'http://fake/';

            ImagePreloader.simplePreload(image)
                .catch(function() {
                    return ImagePreloader.simplePreload(image);
                })
                .then(function() {
                    done(new Error('image has loaded'));
                }, function() {
                    done();
                });
        });
    });

    describe('full image loading', function() {
        this.timeout(20000);

        it('should loading from urls', function(done) {
            var loader = new ImagePreloader();

            loader.preload(images[0], images[1], [images[2], images[3]], images[4])
                .then(function(status) {
                    for (var i = 0; i < status.length; i++) {
                        status[i].status.should.be.true;
                        images.should.contain(status[i].value.src);
                    }

                    done();
                })
                .catch(function(e) {
                    done(e);
                });
        });

        it('should loading from html elements', function(done) {
            var loader = new ImagePreloader(),
                e1 = new Image(),
                e2 = new Image();

            e1.src = images[2];
            e2.src = images[3];

            loader.preload([e1, e2])
                .then(function(status) {
                    for (var i = 0; i < status.length; i++) {
                        status[i].status.should.be.true;
                        [e1.src, e2.src].should.contain(status[i].value.src);
                    }

                    done();
                })
                .catch(function(e) {
                    done(e);
                });
        });

        it('should loading fallback image as url', function(done) {
            var loader = new ImagePreloader(),
                e1 = new Image(),
                e2 = new Image();

            e1.src = images[1];
            e2.src = 'http://fake/';

            loader.fallbackImage = images[0];

            loader.preload(e1, e2)
                .then(function(status) {
                    for (var i = 0; i < status.length; i++) {
                        status[i].status.should.be.true;
                        [e1.src, loader.fallbackImage].should.contain(status[i].value.src);
                    }

                    done();
                })
                .catch(function(e) {
                    done(e);
                });
        });

        it('should set status to false for broken images', function(done) {
            var loader = new ImagePreloader(),
                e1 = new Image(),
                e2 = new Image();

            e1.src = 'http://fake/';
            e2.src = 'http://fake/';

            loader.preload(e1, e2)
                .then(function(status) {
                    for (var i = 0; i < status.length; i++) {
                        status[i].status.should.be.false;
                        [e1, e2].should.contain(status[i].value);
                    }

                    done();
                })
                .catch(function(e) {
                    done(e);
                });
        });

        it('should get broken fallback image and set status to false', function(done) {
            var loader = new ImagePreloader(),
                e1 = new Image(),
                e2 = new Image();

            e1.src = 'http://fake1/';
            e2.src = 'http://fake2/';

            loader.fallbackImage = 'http://fake3/';

            loader.preload(e1, e2)
                .then(function(status) {
                    for (var i = 0; i < status.length; i++) {
                        status[i].status.should.be.false;
                        [e1.src, e2.src].should.contain(status[i].value.src);
                    }

                    done();
                })
                .catch(function(e) {
                    done(e);
                });
        });

        it('should call onProgress for every image', function(done) {
            var loader = new ImagePreloader(),
                loaded = 0;

            loader.fallbackImage = images[0];

            loader.onProgress = function() {
                loaded++;
            };

            loader.preload(images)
                .then(function() {
                    loaded.should.be.equal(images.length);

                    done();
                })
                .catch(function(e) {
                    done(e);
                });
        });
    });
});
