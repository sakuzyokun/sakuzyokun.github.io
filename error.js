        window.addEventListener('load', function() {
            for (let i = 0; i < 100; i++) {
                setTimeout(() => {
                    createMessageBox(i + 1);
                }, 250 * i);
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
            body.innerHTML = 'あなたの電子機器が壊れそうです\n※ジョークです';

            header.appendChild(closeButton);
            messageBox.appendChild(header);
            messageBox.appendChild(body);
            document.body.appendChild(messageBox);
        }
