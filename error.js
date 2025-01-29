window.addEventListener('load', function() {
    for (let i = 0; i < 10; i++) {
        createMessageBox(i + 1);
    }
});

function createMessageBox(index) {
    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';
    messageBox.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
    messageBox.style.left = `${Math.random() * (window.innerWidth - 200)}px`;

    const header = document.createElement('div');
    header.className = 'message-box-header';
    header.innerHTML = `メッセージ ${index}`;

    const closeButton = document.createElement('button');
    closeButton.className = 'close-btn';
    closeButton.innerHTML = '×';
    closeButton.onclick = function() {
        messageBox.remove();
    };

    const body = document.createElement('div');
    body.className = 'message-box-body';
    body.innerHTML = 'ランダムな場所に表示されるメッセージボックス';

    header.appendChild(closeButton);
    messageBox.appendChild(header);
    messageBox.appendChild(body);
    document.body.appendChild(messageBox);
}
