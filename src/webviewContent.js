function getWebviewContent(models) {
    const modelsOptions = models.map(model => `<option value="${model}">${model}</option>`).join('');
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LlamaVerse 🪄✨</title>
        <style id="theme-style">
            :root {
                --background-color: #333;
                --text-color: #f4f4f4;
                --border-color: #444;
                --button-background: #1d72b8;
                --button-text: #fff;
                --button-hover-background: #005bb5;
                --chat-background: #444;
                --toggle-button-background: #666;
                --toggle-button-text: #fff;
                --toggle-button-hover-background: #888;
                --user-message-background: #1e88e5;
                --ai-message-background: #424242;
                --copy-icon-color: #007bff;
                --copy-icon-hover-color: #0056b3;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: var(--background-color);
                color: var(--text-color);
                transition: background-color 0.3s, color 0.3s;
                display: flex;
                flex-direction: column;
                align-items: center;
                overflow: hidden;
                box-sizing: border-box;
            }
            h1 {
                color: var(--text-color);
                font-size: 22px;
                margin: 20px;
                text-align: center;
                font-weight: 600;
                letter-spacing: 0.5px;
                font-variant: small-caps;
            }
            #chat {
                flex: 1;
                overflow-y: auto;
                border-radius: 8px;
                border: 1px solid var(--border-color);
                background-color: var(--chat-background);
                padding: 10px;
                margin: 10px;
                width: 100%;
                max-width: 800px;
                min-height: 400px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                white-space: pre-wrap;
                display: flex;
                flex-direction: column;
            }
            .message-block {
                border-radius: 8px;
                padding: 10px;
                margin: 5px 0;
                display: flex;
                flex-direction: column;
                position: relative;
                word-wrap: break-word;
                max-width: 100%;
            }
            .user-message {
                background-color: var(--user-message-background);
                color: #fff;
                border: 1px solid #1a73e8;
            }
            .ai-message {
                background-color: var(--ai-message-background);
                color: #fff;
                border: 1px solid #666;
                position: relative;
            }
            .copy-icon {
                position: absolute;
                bottom: 5px;
                right: 5px;
                width: 20px;
                height: 20px;
                cursor: pointer;
                fill: var(--copy-icon-color);
                transition: fill 0.3s;
            }
            .copy-icon:hover {
                fill: var(--copy-icon-hover-color);
            }
            #modelSelect, #messageInput {
                width: calc(100% - 20px);
                padding: 10px;
                margin: 10px 0;
                border-radius: 8px;
                border: 1px solid var(--border-color);
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                font-size: 16px;
                max-width: 800px;
                display: block;
            }
            button {
                display: block;
                width: calc(100% - 20px);
                padding: 10px;
                margin: 10px 0;
                border-radius: 8px;
                border: none;
                background-color: var(--button-background);
                color: var(--button-text);
                font-size: 16px;
                cursor: pointer;
                max-width: 800px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: background-color 0.3s;
            }
            button:hover {
                background-color: var(--button-hover-background);
            }
            #themeToggle {
                display: block;
                width: calc(100% - 20px);
                padding: 10px;
                margin: 10px 0;
                border-radius: 8px;
                border: none;
                background-color: var(--toggle-button-background);
                color: var(--toggle-button-text);
                font-size: 16px;
                cursor: pointer;
                max-width: 800px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: background-color 0.3s;
            }
            #themeToggle:hover {
                background-color: var(--toggle-button-hover-background);
            }
        </style>
    </head>
    <body>
        <h1>LlamaVerse 🪄✨</h1>
        <button id="themeToggle">Toggle Light Mode</button>
        <select id="modelSelect">
            ${modelsOptions}
        </select>
        <div id="chat"></div>
        <input type="text" id="messageInput" placeholder="Type your message here..." />
        <button onclick="sendMessage()">Send</button>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js"></script>
        <script>
            const vscode = acquireVsCodeApi();
            const themeToggle = document.getElementById('themeToggle');
            const messageInput = document.getElementById('messageInput');
            const chat = document.getElementById('chat');
            let darkMode = true;
            const converter = new showdown.Converter();

            function toggleTheme() {
                darkMode = !darkMode;
                const style = document.getElementById('theme-style').sheet;

                if (darkMode) {
                    style.insertRule(':root { --background-color: #333; --text-color: #f4f4f4; --border-color: #444; --button-background: #1d72b8; --button-text: #fff; --button-hover-background: #005bb5; --chat-background: #444; --toggle-button-background: #666; --toggle-button-text: #fff; --toggle-button-hover-background: #888; }', style.cssRules.length);
                    themeToggle.textContent = 'Toggle Light Mode';
                } else {
                    style.insertRule(':root { --background-color: #f4f4f4; --text-color: #333; --border-color: #ddd; --button-background: #007aff; --button-text: #fff; --button-hover-background: #005bb5; --chat-background: #fff; --toggle-button-background: #ddd; --toggle-button-text: #333; --toggle-button-hover-background: #bbb; }', style.cssRules.length);
                    themeToggle.textContent = 'Toggle Dark Mode';
                }
            }

            themeToggle.addEventListener('click', toggleTheme);

            function sendMessage() {
                const input = messageInput.value;
                const model = document.getElementById('modelSelect').value;
                if (input.trim()) {
                    vscode.postMessage({
                        command: 'sendMessage',
                        model: model,
                        text: input
                    });
                    chat.innerHTML += \`<div class="message-block user-message"><p><strong>You:</strong> \${converter.makeHtml(input)}</p></div>\`;
                    messageInput.value = '';
                }
            }

            function handleKeyPress(event) {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                }
            }

            function copyToClipboard(text) {
                const tempInput = document.createElement('textarea');
                tempInput.value = text;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
            }

            function addAIResponse(text) {
                const aiMessageBlock = document.createElement('div');
                aiMessageBlock.className = 'message-block ai-message';
                aiMessageBlock.innerHTML = \`
                    <p><strong>LlamaVerse:</strong> \${converter.makeHtml(text)}</p>
                \`;
                chat.appendChild(aiMessageBlock);
                chat.scrollTop = chat.scrollHeight;
            }

            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.command) {
                    case 'addResponse':
                        addAIResponse(message.text);
                        break;
                }
            });

            messageInput.addEventListener('keydown', handleKeyPress);
        </script>
    </body>
    </html>
    `;
}

module.exports = { getWebviewContent };
