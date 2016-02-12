## Classes

<dl>
<dt><a href="#ImagePreloader">ImagePreloader</a></dt>
<dd><p>ImagePreloader</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#allSettled">allSettled</a></dt>
<dd></dd>
</dl>

<a name="ImagePreloader"></a>
## ImagePreloader
ImagePreloader

**Kind**: global class  

* [ImagePreloader](#ImagePreloader)
    * [new ImagePreloader([fallbackImage], [onProgress])](#new_ImagePreloader_new)
    * _instance_
        * [.onProgress](#ImagePreloader+onProgress) : <code>function</code>
        * [.fallbackImage](#ImagePreloader+fallbackImage) : <code>String</code> &#124; <code>HTMLImageElement</code>
        * [.preload(...args)](#ImagePreloader+preload) ⇒ <code>Promise</code>
    * _static_
        * [.simplePreload(imageSource)](#ImagePreloader.simplePreload) ⇒ <code>Promise</code>

<a name="new_ImagePreloader_new"></a>
### new ImagePreloader([fallbackImage], [onProgress])
Image preloader


| Param | Type |
| --- | --- |
| [fallbackImage] | <code>String</code> &#124; <code>HTMLImageElement</code> | 
| [onProgress] | <code>function</code> | 

<a name="ImagePreloader+onProgress"></a>
### imagePreloader.onProgress : <code>function</code>
**Kind**: instance property of <code>[ImagePreloader](#ImagePreloader)</code>  
<a name="ImagePreloader+fallbackImage"></a>
### imagePreloader.fallbackImage : <code>String</code> &#124; <code>HTMLImageElement</code>
**Kind**: instance property of <code>[ImagePreloader](#ImagePreloader)</code>  
<a name="ImagePreloader+preload"></a>
### imagePreloader.preload(...args) ⇒ <code>Promise</code>
Preload image.

If fallbackImage-property is defined and correct, then src-attribute for the broken images will replaced by fallbackImage
As well, origin image url will be placed to 'data-fail-src' attribute.

If onProgress-method is defined, then this method will be calling for every image loading (fulfilled of rejected).

**Kind**: instance method of <code>[ImagePreloader](#ImagePreloader)</code>  
**Returns**: <code>Promise</code> - will be resolved with Array<{status:boolean, value:HTMLImageElement}>

    status-property - is the status of image loading
    status-property will be true if:
     - original image loading is ok
     - or original image loading is fail but fallback-image loading is ok
    status-property will be false if:
     - original image loading is fail
     - or original image loading is fail and fallback-image loading is fail

    value-property - is the image that was loaded  

| Param | Type |
| --- | --- |
| ...args | <code>String</code> &#124; <code>HTMLImageElement</code> &#124; <code>Array.&lt;(String\|HTMLImageElement)&gt;</code> | 

<a name="ImagePreloader.simplePreload"></a>
### ImagePreloader.simplePreload(imageSource) ⇒ <code>Promise</code>
Do simple image preloading.

**Kind**: static method of <code>[ImagePreloader](#ImagePreloader)</code>  
**Returns**: <code>Promise</code> - will be resolved/rejected with HTMLImageElement  

| Param | Type |
| --- | --- |
| imageSource | <code>String</code> &#124; <code>HTMLImageElement</code> | 

<a name="allSettled"></a>
## allSettled
**Kind**: global variable  
**Licence**: MIT  
**Author:** Sergey Melyukov  
