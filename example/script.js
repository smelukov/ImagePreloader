/**
 * @author Sergey Melyukov
 */

var preloader = new ImagePreloader(),
    urls = ['http://wallpapersdesk.net/wp-content/uploads/2015/03/3462_space.jpg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ6n9k9Xg_7Kyx4wqe03ntTWu7k7DZi-XCtFrqQobGobL0MjjS'],
    images = Array.prototype.slice.call(document.getElementsByTagName('img')).concat(urls),
    total = images.length,
    loaded = 0;

preloader.onProgress = function() {
    progress.textContent = progress.style.width = parseInt(100 / total * ++loaded) + '%';
};

preloader.failImage = 'https://browshot.com/static/images/not-found.png';
preloader.preload(images)
    .delay(500)
    .then(function(result) {
        loadingBlock.classList.add('hidden');

        result.forEach(function(image) {
            if (image.status) {
                container.appendChild(image.value);
                image.value.classList.add('img-rounded', 'loaded');
            } else {
                image.value.remove();
            }
        })
    });
