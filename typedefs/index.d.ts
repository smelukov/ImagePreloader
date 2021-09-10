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
declare type OnProgress = (r: Result) => void;
export default class ImagePreloader {
    onProgress: OnProgress | null;
    fallbackImage: HTMLImageElement | string | null;
    constructor(fallbackImage?: HTMLImageElement | string, onProgress?: OnProgress);
    /**
     * Preload image.
     *
     * If fallbackImage-property is defined and correct, then src-attribute for the broken images will replaced by fallbackImage
     * As well, origin image url will be placed to 'data-fail-src' attribute.
     *
     * If onProgress-method is defined, then this method will be calling for every image loading (fulfilled of rejected).
     */
    preload(images: Array<string | HTMLImageElement>): Promise<Result[]>;
    /**
     * Do simple image preloading.
     * @return will be resolved/rejected with HTMLImageElement
     */
    static simplePreload: typeof simplePreload;
}
export {};
