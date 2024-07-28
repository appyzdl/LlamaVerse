function getWebviewContent(models) {
    const modelsOptions = models.map(model => `<option value="${model}">${model}</option>`).join('');
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LlamaVerse 🪄✨</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            #chat { height: 300px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
            #modelSelect, #messageInput { width: 100%; padding: 5px; margin-bottom: 10px; }
            button { padding: 5px 10px; }
        </style>
    </head>
    <body>
        <h1>LlamaVerse 🪄✨</h1>
        <select id="modelSelect">
            ${modelsOptions}
        </select>
        <div id="chat"></div>
        <input type="text" id="messageInput" placeholder="Type your message here..." />
        <button onclick="sendMessage()">Send</button>
        <script>
            const vscode = acquireVsCodeApi();
            function sendMessage() {
                const input = document.getElementById('messageInput');
                const model = document.getElementById('modelSelect').value;
                vscode.postMessage({
                    command: 'sendMessage',
                    model: model,
                    text: input.value
                });
                const chat = document.getElementById('chat');
                chat.innerHTML += \`<p><strong>You:</strong> \${input.value}</p>\`;
                input.value = '';
            }
            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.command) {
                    case 'addResponse':
                        const chat = document.getElementById('chat');
                        chat.innerHTML += \`<p><strong>AI:</strong> \${message.text}</p>\`;
                        chat.scrollTop = chat.scrollHeight;
                        break;
                }
            });
        </script>
    </body>
    </html>
    `;
}

module.exports = { getWebviewContent };