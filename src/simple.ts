export default function simplePreload(
	imageSource: HTMLImageElement | string
): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		let img: HTMLImageElement;

		if (imageSource instanceof HTMLImageElement) {
			img = imageSource;

			if (!img.complete) {
				img.onload = () => resolve(img);
				img.onerror = img.onabort = () => reject(img);
			} else if (img.naturalHeight) {
				resolve(img);
			} else {
				reject(img);
			}
		} else {
			img = new Image();
			img.onload = () => resolve(img);
			img.onerror = img.onabort = () => reject(img);
			img.src = imageSource;
		}
	});
}
