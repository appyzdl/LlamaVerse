import os
import requests
import socket


class OllamaService:
    OLLAMA_PORTS = [int(os.getenv('OLLAMA_DEFAULT_PORT', 11434)), 8080, 3000]

    def __init__(self):
        self.port = self._find_ollama_port()

    def _find_ollama_port(self):
        for port in self.OLLAMA_PORTS:
            try:
                with socket.create_connection(("localhost", port), timeout=1):
                    return port
            except (socket.timeout, ConnectionRefusedError):
                continue
        return None

    def fetch_models(self):
        try:
            response = requests.get(f"http://localhost:{self.port}/api/tags")
            data = response.json()
            return [model["name"] for model in data["models"]]
        except Exception as e:
            print(f"Error fetching Ollama models: {e}")
            return []

    def send_message(self, model, message):
        try:
            response = requests.post(f"http://localhost:{self.port}/api/generate", json={
                "model": model,
                "prompt": message
            })
            data = response.json()
            return data["response"]
        except Exception as e:
            print(f"Error sending message to Ollama: {e}")
            return "Error: Unable to get response from Ollama"
