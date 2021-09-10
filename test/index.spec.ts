import ImagePreloader from "../src/index";

const images = [
	"http://dummyimage.com/800x600/000000/fff.jpg",
	"http://dummyimage.com/800x600/000000/f00.jpg",
	"http://dummyimage.com/800x600/000000/0f0.jpg",
	"http://dummyimage.com/800x600/000000/00f.jpg",
	"http://dummyimage.com/800x600/000000/f0f.jpg",
];

jest.setTimeout(10000);

describe("simple image loading", () => {
	it("should loading from url", (done) => {
		ImagePreloader.simplePreload(images[0]).then(
			() => done(),
			() => done(new Error())
		);
	});

	it("should loading from html element", (done) => {
		var image = new Image();

		image.src = images[0];

		ImagePreloader.simplePreload(image).then(
			() => done(),
			() => done(new Error())
		);
	});

	it("should loading from already loaded html element", (done) => {
		var image = new Image();

		image.src = images[0];

		ImagePreloader.simplePreload(image)
			.then(() => {
				return ImagePreloader.simplePreload(image);
			})
			.then(
				() => done(),
				() => done(new Error("image loading has failed"))
			);
	});

	it("should fail loading from string", (done) => {
		ImagePreloader.simplePreload("http://fake/").then(
			() => done(new Error()),
			() => done()
		);
	});

	it("should fail loading from html element", (done) => {
		var image = new Image();

		image.src = "http://fake/";

		ImagePreloader.simplePreload(image).then(
			() => done(new Error()),
			() => done()
		);
	});

	it("should fail loading from already failed html element", (done) => {
		var image = new Image();

		image.src = "http://fake/";

		ImagePreloader.simplePreload(image)
			.catch(() => {
				return ImagePreloader.simplePreload(image);
			})
			.then(
				() => done(new Error("image has loaded")),
				() => done()
			);
	});
});

describe("full image loading", () => {
	it("should loading from urls", (done) => {
		var loader = new ImagePreloader();

		loader
			.preload([images[0], images[1], images[2], images[3], images[4]])
			.then((status) => {
				for (var i = 0; i < status.length; i++) {
					expect(status[i].status).toBe(true);
					expect(images).toContain(status[i].value.src);
				}

				done();
			})
			.catch((e) => done(e));
	});

	it("should loading from html elements", (done) => {
		var loader = new ImagePreloader(),
			e1 = new Image(),
			e2 = new Image();

		e1.src = images[2];
		e2.src = images[3];

		loader
			.preload([e1, e2])
			.then((status) => {
				for (var i = 0; i < status.length; i++) {
					expect(status[i].status).toBe(true);
					expect([e1.src, e2.src]).toContain(status[i].value.src);
				}

				done();
			})
			.catch((e) => done(e));
	});

	it("should loading fallback image as url", (done) => {
		var loader = new ImagePreloader(),
			e1 = new Image(),
			e2 = new Image();

		e1.src = images[1];
		e2.src = "http://fake/";

		loader.fallbackImage = images[0];

		loader
			.preload([e1, e2])
			.then((status) => {
				for (var i = 0; i < status.length; i++) {
					expect(status[i].status).toBe(true);
					expect([e1.src, loader.fallbackImage]).toContain(
						status[i].value.src
					);
				}

				done();
			})
			.catch((e) => done(e));
	});

	it("should set status to false for broken images", (done) => {
		var loader = new ImagePreloader(),
			e1 = new Image(),
			e2 = new Image();

		e1.src = "http://fake/";
		e2.src = "http://fake/";

		loader
			.preload([e1, e2])
			.then((status) => {
				for (var i = 0; i < status.length; i++) {
					expect(status[i].status).toBe(false);
					expect([e1, e2]).toContain(status[i].value);
				}

				done();
			})
			.catch((e) => done(e));
	});

	it("should get broken fallback image and set status to false", (done) => {
		var loader = new ImagePreloader(),
			e1 = new Image(),
			e2 = new Image();

		e1.src = "http://fake1/";
		e2.src = "http://fake2/";

		loader.fallbackImage = "http://fake3/";

		loader
			.preload([e1, e2])
			.then((status) => {
				for (var i = 0; i < status.length; i++) {
					expect(status[i].status).toBe(false);
					expect([e1.src, e2.src]).toContain(status[i].value.src);
				}

				done();
			})
			.catch((e) => done(e));
	});

	it("should call onProgress for every image", (done) => {
		var loader = new ImagePreloader(),
			loaded = 0;

		loader.fallbackImage = images[0];

		loader.onProgress = () => {
			loaded++;
		};

		loader
			.preload(images)
			.then(() => {
				expect(loaded).toBe(images.length);

				done();
			})
			.catch((e) => done(e));
	});
});
