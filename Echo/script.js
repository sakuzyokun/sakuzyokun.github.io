document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chatLog');
    const userInput = document.getElementById('userInput');
    
    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        
        if (sender === 'bot') {
            const botImage = document.createElement('img');
            botImage.src = 'Echo.png'; // ここにBotの画像URLを設定
            botImage.alt = 'Bot';
            messageElement.appendChild(botImage);
        }

        const textNode = document.createElement('span');
        messageElement.appendChild(textNode);
        chatLog.appendChild(messageElement);

        let index = 0;
        function typeWriter() {
            if (index < message.length) {
                textNode.textContent += message.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        }
        typeWriter();
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function sendMessage() {
        const message = userInput.value.trim().toLowerCase();
        if (['クリア', 'clear', 'くりあ', 'kuria', '綺麗', 'kuria', 'kirei'].includes(message)) {
            appendMessage(message, 'user');
            userInput.value = '';
            // Botの考える時間を表すダミーメッセージを追加
            const botThinkingMessage = document.createElement('div');
            botThinkingMessage.className = 'chat-message bot';
            const botImage = document.createElement('img');
            botImage.src = 'Echo.gif'; // Botが考えている間に表示する画像
            botImage.alt = 'Bot is thinking';
            botThinkingMessage.appendChild(botImage);
            chatLog.appendChild(botThinkingMessage);
            chatLog.scrollTop = chatLog.scrollHeight;

            setTimeout(() => {
                // ダミーメッセージを削除
                chatLog.removeChild(botThinkingMessage);
                
                // Botの返信を追加
                appendMessage('クリアします。', 'bot');
                setTimeout(() => {
                    goToHome();
                }, 1000);
            }, 1500); // 1.5秒後にBotの返信を表示
            
        } else if (['ホーム', 'home', 'ほーむ', 'ho-mu'].includes(message)) {
            appendMessage(message, 'user');
            userInput.value = '';
            // Botの考える時間を表すダミーメッセージを追加
            const botThinkingMessage = document.createElement('div');
            botThinkingMessage.className = 'chat-message bot';
            const botImage = document.createElement('img');
            botImage.src = 'Echo.gif'; // Botが考えている間に表示する画像
            botImage.alt = 'Bot is thinking';
            botThinkingMessage.appendChild(botImage);
            chatLog.appendChild(botThinkingMessage);
            chatLog.scrollTop = chatLog.scrollHeight;

            setTimeout(() => {
                // ダミーメッセージを削除
                chatLog.removeChild(botThinkingMessage);
                
                // Botの返信を追加
                appendMessage('ホームに戻ります。', 'bot');
                setTimeout(() => {
                    location.href = '../index.html';
                }, 1000);
            }, 1500); // 1.5秒後にBotの返信を表示
            
        } else if (['情報', 'info', 'zyouhou', 'じょうほう', 'ジョウホウ', 'バージョン', 'ばーじょん', 'ba-zyon', 'ba-zyonn', 'ver', 'version'].includes(message)) {
            appendMessage(message, 'user');
            userInput.value = '';
            // Botの考える時間を表すダミーメッセージを追加
            const botThinkingMessage = document.createElement('div');
            botThinkingMessage.className = 'chat-message bot';
            const botImage = document.createElement('img');
            botImage.src = 'Echo.gif'; // Botが考えている間に表示する画像
            botImage.alt = 'Bot is thinking';
            botThinkingMessage.appendChild(botImage);
            chatLog.appendChild(botThinkingMessage);
            chatLog.scrollTop = chatLog.scrollHeight;

            setTimeout(() => {
                // ダミーメッセージを削除
                chatLog.removeChild(botThinkingMessage);
                
                // Botの返信を追加
                appendMessage('Bot バージョン 1.4.5', 'bot');
            }, 1500); // 1.5秒後にBotの返信を表示
        } else if (['ヘルプ', 'help', 'helupu', 'へるぷ'].includes(message)) {
                appendMessage(message, 'user');
                userInput.value = '';
                // Botの考える時間を表すダミーメッセージを追加
                const botThinkingMessage = document.createElement('div');
                botThinkingMessage.className = 'chat-message bot';
                const botImage = document.createElement('img');
                botImage.src = 'Echo.gif'; // Botが考えている間に表示する画像
                botImage.alt = 'Bot is thinking';
                botThinkingMessage.appendChild(botImage);
                chatLog.appendChild(botThinkingMessage);
                chatLog.scrollTop = chatLog.scrollHeight;
    
                setTimeout(() => {
                    // ダミーメッセージを削除
                    chatLog.removeChild(botThinkingMessage);
                    
                    // Botの返信を追加
                    appendMessage('落ち着いてやりましょう!対応しているコマンドは以下の通りです:\n情報:このBotの情報を表示します\nクリア:新しいチャットを開始します\nホーム:削除くんのホームページに戻ります\nEchoの問い合わせ:Echoのお問い合わせページを表示します\nヘルプ:ヘルプを表示します', 'bot');
                }, 1500); // 1.5秒後にBotの返信を表示
            }else if (['こんにちは', 'こんにちは!', 'こんちくわ', 'こんちわ', 'コンニチハ', 'konnnitiha', 'hello'].includes(message)) {
            appendMessage(message, 'user');
            userInput.value = '';
            // Botの考える時間を表すダミーメッセージを追加
            const botThinkingMessage = document.createElement('div');
            botThinkingMessage.className = 'chat-message bot';
            const botImage = document.createElement('img');
            botImage.src = 'Echo.gif'; // Botが考えている間に表示する画像
            botImage.alt = 'Bot is thinking';
            botThinkingMessage.appendChild(botImage);
            chatLog.appendChild(botThinkingMessage);
            chatLog.scrollTop = chatLog.scrollHeight;

            setTimeout(() => {
                // ダミーメッセージを削除
                chatLog.removeChild(botThinkingMessage);
                
                // Botの返信を追加
                appendMessage('こんにちは!何かご用ですか?', 'bot');
            }, 1500); // 1.5秒後にBotの返信を表示
        }else if (['ありがとう', 'ありがとう!', 'ありがとうございます', 'ありがとうございます!', 'あんがと', 'tenkyou', 'arigatou'].includes(message)) {
                appendMessage(message, 'user');
                userInput.value = '';
                // Botの考える時間を表すダミーメッセージを追加
                const botThinkingMessage = document.createElement('div');
                botThinkingMessage.className = 'chat-message bot';
                const botImage = document.createElement('img');
                botImage.src = 'Echo.gif'; // Botが考えている間に表示する画像
                botImage.alt = 'Bot is thinking';
                botThinkingMessage.appendChild(botImage);
                chatLog.appendChild(botThinkingMessage);
                chatLog.scrollTop = chatLog.scrollHeight;
    
                setTimeout(() => {
                    // ダミーメッセージを削除
                    chatLog.removeChild(botThinkingMessage);
                    
                    // Botの返信を追加
                    appendMessage('どういたしまして!他に何かご用ですか?', 'bot');
                }, 1500); // 1.5秒後にBotの返信を表示
            }else if (['提案', '問い合わせ', 'お問い合わせ', 'ていあん', 'テイアン', 'おといあわせ', 'オトイアワセ', 'といあわせ' , 'トイアワセ', 'teiann', 'teian', 'otoiawase', 'toiawase', 'エコーの問い合わせ', 'echoの問い合わせ', 'えこーの問い合わせ', 'えこーのといあわせ', 'エコーノトイアワセ', 'eko-notoiawase', 'echonotoiawase'].includes(message)) {
                appendMessage(message, 'user');
                userInput.value = '';
                // Botの考える時間を表すダミーメッセージを追加
                const botThinkingMessage = document.createElement('div');
                botThinkingMessage.className = 'chat-message bot';
                const botImage = document.createElement('img');
                botImage.src = 'Echo.gif'; // Botが考えている間に表示する画像
                botImage.alt = 'Bot is thinking';
                botThinkingMessage.appendChild(botImage);
                chatLog.appendChild(botThinkingMessage);
                chatLog.scrollTop = chatLog.scrollHeight;
    
                setTimeout(() => {
                    // ダミーメッセージを削除
                    chatLog.removeChild(botThinkingMessage);
                    
                    // Botの返信を追加
                    appendMessage('お問い合わせページを表示します', 'bot');
                    setTimeout(() => {
                        window.open('https://forms.office.com/r/SDnfkrirdc','_blank');
                    }, 1000);
                }, 1500); // 1.5秒後にBotの返信を表示
            }else if (message){
            appendMessage(message, 'user');
            userInput.value = '';
            
            // Botの考える時間を表すダミーメッセージを追加
            const botThinkingMessage = document.createElement('div');
            botThinkingMessage.className = 'chat-message bot';
            const botImage = document.createElement('img');
            botImage.src = 'Echo.gif'; // Botが考えている間に表示する画像
            botImage.alt = 'Bot is thinking';
            botThinkingMessage.appendChild(botImage);
            chatLog.appendChild(botThinkingMessage);
            chatLog.scrollTop = chatLog.scrollHeight;

            setTimeout(() => {
                // ダミーメッセージを削除
                chatLog.removeChild(botThinkingMessage);
                
                // Botの返信を追加
                appendMessage('すみません。分かりませんでした。くわしくは「ヘルプ」をご覧ください!', 'bot');
            }, 1500); // 1.5秒後にBotの返信を表示
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    function goToHome() {
        chatLog.innerHTML = '';
        appendMessage('新しいチャットをしましょう!', 'bot');
    }

    // ページロード時にメッセージを表示
    setTimeout(() => {
        appendMessage('こんにちは! Echoです!', 'bot');
    }, 500); // 0.5秒後に表示

    window.sendMessage = sendMessage;
    window.handleKeyPress = handleKeyPress;
});
