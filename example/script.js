/**
 * @licence MIT
 * @author Sergey Melyukov
 * @contributor Lucian Last
 */

const progressEl = document.getElementById("progress"),
	loadingTextEl = document.getElementById("loadingText"),
	resultsEl = document.getElementById("results");

const preloader = new ImagePreloader(),
	urls = [
		"http://wallpapersdesk.net/wp-content/uploads/2015/03/3462_space.jpg",
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ6n9k9Xg_7Kyx4wqe03ntTWu7k7DZi-XCtFrqQobGobL0MjjS",
	],
	imageEls = Array.from(resultsEl.getElementsByTagName("img")),
	images = [].concat(imageEls, urls);

let total = images.length,
	loaded = 0;

preloader.onProgress = ({ status, value }) => {
	let percentLoaded = Math.floor((100 / total) * ++loaded);
	setProgressBar(percentLoaded);

	if (status === false) {
		value.classList.add("failed");
	} else if (value.hasAttribute("data-fail-src")) {
		value.classList.add("fallback");
	} else {
		value.classList.add("loaded");
	}
};
preloader.fallbackImage = "https://browshot.com/static/images/not-found.png";
preloader.preload(images).then((result) => {
	console.log(result);
	loadingTextEl.textContent = "Done";

	result.forEach((image, i) => {
		let imageEl = imageEls[i];
		if (!imageEl) {
			imageEl = image.value;
			resultsEl.appendChild(imageEl);
		}
	});
});

function setProgressBar(percent) {
	progressEl.value = progressEl.style.width = percent / 100;
}
