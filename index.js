window.addEventListener('load', showMessageBox);

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
