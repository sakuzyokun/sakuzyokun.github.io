let slideIndex = 0;
let slideshowInterval;

document.addEventListener("DOMContentLoaded", function() {
    playSlideshow(); // ページロード時に自動再生を開始
});

function showSlides(n) {
    let slides = document.getElementsByClassName("slides");
    if (n >= slides.length) { slideIndex = 0; }
    if (n < 0) { slideIndex = slides.length - 1; }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex].style.display = "block";
}

function playSlideshow() {
    let displayTime = parseInt(document.getElementById("display-time").value);
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(() => {
        slideIndex++;
        showSlides(slideIndex);
    }, displayTime);
}

function pauseSlideshow() {
    clearInterval(slideshowInterval);
}

function applySettings() {
    let folderInput = document.getElementById("folder");
    let files = folderInput.files;
    let slideshowContainer = document.getElementById("slideshow-container");
    let transition = document.getElementById("transition").value;

    // デフォルトのテスト画像を設定
    if (files.length === 0) {
        files = [
            { name: "0light.jpg", url: "images/0light.jpg" },
            { name: "1dark.jpg", url: "images/1dark.jpg" },
            { name: "img0.jpg", url: "error408/img0.jpg" }
        ];
    }

    slideshowContainer.innerHTML = "";

    for (let file of files) {
        let slideDiv = document.createElement("div");
        slideDiv.className = `slides ${transition}`;
        let img = document.createElement("img");
        img.src = file.url ? file.url : URL.createObjectURL(file);
        slideDiv.appendChild(img);
        slideshowContainer.appendChild(slideDiv);
    }

    // ボタンを再生成して追加
    let controlsHTML = `
        <div class="controls">
            <a class="prev" onclick="changeSlide(-1)">&#10094;</a>
            <a class="next" onclick="changeSlide(1)">&#10095;</a>
        </div>
        <div class="control-buttons">
            <button class="play" onclick="playSlideshow()">&#9654;</button>
            <button class="pause" onclick="pauseSlideshow()">&#10074;&#10074;</button>
            <button class="settings" onclick="toggleSettings()">&#9881;</button>
        </div>
    `;
    slideshowContainer.insertAdjacentHTML('beforeend', controlsHTML);

    slideIndex = 0;
    showSlides(slideIndex);
    playSlideshow();
}

function changeSlide(n) {
    showSlides(slideIndex += n);
}

function toggleSettings() {
    let settingsContainer = document.querySelector('.settings-container');
    settingsContainer.style.display = settingsContainer.style.display === 'none' ? 'block' : 'none';
}
