jest.setTimeout(10000);

/** This requires canvas installed and testEnvironmentOptions: { resources: "usable" }`
 * @see https://github.com/jsdom/jsdom/issues/1816
 */
test("if jest is configured properly", () => {
	function loadImg(src: string) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = img.onabort = () => reject(img);
			img.src = src;
		});
	}

	const sut = loadImg("http://dummyimage.com/800x600/000000/fff.jpg");
	return sut;
});
