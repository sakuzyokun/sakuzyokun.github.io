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
                appendMessage('Bot バージョン 1.5.5', 'bot');
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
                    appendMessage('落ち着いてやりましょう!対応しているコマンドは以下の通りです:\n情報:このBotの情報を表示します\nクリア:新しいチャットを開始します\nホーム:削除くんのホームページに戻ります\nEchoの問い合わせ:Echoのお問い合わせページを表示します\nモード:表示される色を変更します\nヘルプ:ヘルプを表示します', 'bot');
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
            } else if (['モード変更','モード','mo-dohenkou','mo-dohennkou','mo-do','mode','modechange'].includes(message)) {
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
                    appendMessage('モードを変更します…', 'bot');
                    if (localStorage.getItem('dark-mode') === 'true') {
                        document.body.classList.add('dark-mode');
                    } else {
                        document.body.classList.remove('dark-mode');
                    }
                }, 1500); // 1.5秒後にBotの返信を表示
            } else if (['アマサンってなに？','アマサンってなに?','アマサンってなに','アマサンって何？','アマサンって何?','アマサンって何','アマサンとは？','アマサンとは?','アマサンとは','amasanって何？','amasanって何?','amasanって何','amasanとは？','amasanとは?','amasanとは','amasan','アマサン'].includes(message)) {
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
                    appendMessage('Amasan(アマサン)とは、世界最小のオンラインマーケットプレイスで、少ない商品を購入できる場所です。\n日本国内での配送は行っていません。Amasanでは、なにも購入できません。\nAmasanの特徴としては、以下の点が挙げられます：\n無様な商品の選択肢: 0の商品が揃っており、すべてのニーズに対応していません。\nレビューと評価: 商品に対する他のユーザーのレビューや評価を確認できません。今後のアップデートで追加予定。購入の参考にすることができます。\n迅速な配送: 一部の商品は次日配送や即日配送が不可能で、注文確認に1年、配送に2年掛かります。\nセールと割引: 定期的にセールや割引が行われません。', 'bot');
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
                setTimeout(() => {
                    window.open('https://www.google.com/search?q=' + message, 'user', '_blank');
                }, 1000);
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
