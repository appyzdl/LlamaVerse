const vscode = require('vscode');
const OllamaService = require('./ollamaService');
const { getWebviewContent } = require('./webviewContent');

function activate(context) {
    console.log('LlamaVerse: VSCode Edition is now active!');

    const ollamaService = new OllamaService();

    let disposable = vscode.commands.registerCommand('llamaverse.start', async () => {
        const port = await ollamaService.findOllamaPort();
        if (!port) {
            vscode.window.showErrorMessage(
                "Ollama is not running on any expected port. Please start Ollama and try again. Try Ollama server on your terminal"
            );
            return;
        }

        const models = await ollamaService.fetchModels();
        if (!models || models.length === 0) {
            vscode.window.showErrorMessage("Failed to fetch Ollama models. Is Ollama running?");
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'llamaverseChat',
            'LlamaVerse Chat',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true
            }
        );

        panel.webview.html = getWebviewContent(models);

        panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'sendMessage':
                        const response = await ollamaService.sendMessage(message.model, message.text);
                        panel.webview.postMessage({ command: 'addResponse', text: response });
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}