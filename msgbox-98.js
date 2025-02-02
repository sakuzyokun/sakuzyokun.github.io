document.getElementById('applyButton').addEventListener('click', function() {
    var customMessage = document.getElementById('customMessage').value;
    var customTitle = document.getElementById('customTitle').value;
    var customButtons = document.getElementById('customButtons').value.split(',');

    document.getElementById('message').textContent = customMessage;
    document.getElementById('titleText').textContent = customTitle;

    var buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.innerHTML = '';  // 既存のボタンを削除

    customButtons.forEach(function(buttonLabel) {
        var button = document.createElement('button');
        button.textContent = buttonLabel.trim();
        buttonContainer.appendChild(button);
    });

    var buttonSet = document.getElementById('buttonSet').value;
    var titleBarControls = document.getElementById('titleBarControls');

    if (buttonSet === "minimize-maximize-close") {
        titleBarControls.innerHTML = `
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize" id="maximizeButton"></button>
            <button aria-label="Close"></button>
        `;
    } else if (buttonSet === "minimize-restore-close") {
        titleBarControls.innerHTML = `
            <button aria-label="Minimize"></button>
            <button aria-label="Restore" id="restoreButton"></button>
            <button aria-label="Close"></button>
        `;
    } else {
        titleBarControls.innerHTML = `
            <button aria-label="Close"></button>
        `;
    }
});

// メッセージボックスをドラッグして移動できるようにする
dragElement(document.getElementById("messageBox"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    document.getElementById("titleBar").onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
