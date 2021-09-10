/**
 * @licence MIT
 * @author Sergey Melyukov
 * @constructor Lucian Last
 */

import simplePreload from "./simple";

interface Result {
	/**
	 * The status of image loading
	 *
	 * status will be true if:
	 * - original image loading is ok
	 * - or original image loading is fail but fallback-image loading is ok
	 *
	 * status will be false if:
	 * - original image loading is fail
	 * - or original image loading is fail and fallback-image loading is fail
	 */
	status: boolean;
	/** The image that was loaded */
	value: HTMLImageElement;
}
type OnProgress = (r: Result) => void;

export default class ImagePreloader {
	public onProgress: OnProgress | null;
	public fallbackImage: HTMLImageElement | string | null;

	constructor(
		fallbackImage?: HTMLImageElement | string,
		onProgress?: OnProgress
	) {
		this.onProgress = typeof onProgress === "function" ? onProgress : null;
		this.fallbackImage =
			typeof fallbackImage === "string" ||
			fallbackImage instanceof HTMLImageElement
				? fallbackImage
				: null;
	}

	/**
	 * Preload image.
	 *
	 * If fallbackImage-property is defined and correct, then src-attribute for the broken images will replaced by fallbackImage
	 * As well, origin image url will be placed to 'data-fail-src' attribute.
	 *
	 * If onProgress-method is defined, then this method will be calling for every image loading (fulfilled of rejected).
	 */
	public preload(
		images: Array<string | HTMLImageElement>
	): Promise<Result[]> {
		const imagesToLoad: Promise<HTMLImageElement>[] = images.map(
			(imageSource) => {
				return ImagePreloader.simplePreload(imageSource)
					.catch((brokenImage: HTMLImageElement) => {
						if (this.fallbackImage) {
							return ImagePreloader.simplePreload(
								this.fallbackImage
							).then(
								(fallbackImage) => {
									brokenImage.setAttribute(
										"data-fail-src",
										brokenImage.src
									);
									brokenImage.src = fallbackImage.src;

									return brokenImage;
								},
								() => Promise.reject(brokenImage)
							);
						}

						return Promise.reject(brokenImage);
					})
					.then(
						(loadedImage: HTMLImageElement) => {
							if (this.onProgress) {
								this.onProgress({
									status: true,
									value: loadedImage,
								});
							}
							return loadedImage;
						},
						(brokenImage: HTMLImageElement) => {
							if (this.onProgress) {
								this.onProgress({
									status: false,
									value: brokenImage,
								});
							}
							return Promise.reject(brokenImage);
						}
					);
			}
		);

		return Promise.allSettled(imagesToLoad).then((settledImages) => {
			return settledImages.map<Result>((settledImage) => {
				if (settledImage.status === "rejected") {
					return {
						status: false,
						value: settledImage.reason as HTMLImageElement,
					};
				}

				return {
					status: true,
					value: settledImage.value,
				};
			});
		});
	}

	/**
	 * Do simple image preloading.
	 * @return will be resolved/rejected with HTMLImageElement
	 */
	static simplePreload = simplePreload;
}
