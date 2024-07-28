import vscode
from .ollama_service import OllamaService
from .webview_content import get_webview_content


def active(context):
    print("LlamaVerse is now active!")

    ollama_service = OllamaService()

    disposable = vscode.commands.register_command(
        "llamaverse.start", lambda: start_chat(ollama_service))
    context.subscriptions.append(disposable)


def start_chat(ollama_service):
    if not ollama_service.port:
        vscode.window.show_error_message(
            "Ollama is not running on any expected port. Please start Ollama and try again."
        )
        return

    models = ollama_service.fetch_models()
    if not models:
        vscode.window.show_error_message(
            "Failed to fetch Ollama models. Check if Ollama is running or not. Try Ollama serve on terminal to turn of Ollama on local http client"
        )
        return

    panel = vscode.window.create_webview_panel(
        "llamaVerse",
        "Llama Verse",
        vscode.ViewColumn.BESIDE,
        {
            "enable_scripts": True
        }
    )

    panel.webview.html = get_webview_content(models)

    def on_did_receive_message(message):
        if message["command"] == "sendMessage":
            response = ollama_service.send_message(
                message["model"], message["text"])
            panel.webview.post_message({
                "command": "addResponse",
                "text": response
            })

    panel.webview.on_did_receive_message = on_did_receive_message


def deactivate():
    pass
