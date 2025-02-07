window.addEventListener('load', function() {
    if (!isMobile() && !isMac()) {
        showMessageBox();
    } else if (isMac()) {
        createToggleButton();
    }
});

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
}

function isMac() {
    return /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent);
}

function showMessageBox() {
    const messageBox = document.getElementById('messageBox');
    messageBox.style.display = 'block';
    moveMessageBox();

    setInterval(moveMessageBox, 1000);
}

function closeMessageBox() {
    document.getElementById('messageBox').style.display = 'none';
}

function moveMessageBox() {
    const messageBox = document.getElementById('messageBox');
    const x = Math.floor(Math.random() * (window.innerWidth - messageBox.clientWidth));
    const y = Math.floor(Math.random() * (window.innerHeight - messageBox.clientHeight));
    messageBox.style.left = `${x}px`;
    messageBox.style.top = `${y}px`;
}

function web() {
    window.open('YouTube.html', '_blank');
}

function createToggleButton() {
    const button = document.createElement('button');
    button.textContent = 'Toggle Message Box';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.left = '50%';
    button.style.transform = 'translateX(-50%)';
    button.addEventListener('click', toggleMessageBox);
    document.body.appendChild(button);
}

function toggleMessageBox() {
    const messageBox = document.getElementById('messageBox');
    if (messageBox.style.display === 'block') {
        messageBox.style.display = 'none';
    } else {
        messageBox.style.display = 'block';
    }
}
