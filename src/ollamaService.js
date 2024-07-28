const axios = require('axios');
const net = require('net');

class OllamaService {
    constructor() {
        this.OLLAMA_PORTS = [11434, 8080, 3000];
        this.port = null;
    }

    async findOllamaPort() {
        for (const port of this.OLLAMA_PORTS) {
            try {
                await new Promise((resolve, reject) => {
                    const socket = new net.Socket();
                    socket.setTimeout(1000);
                    socket.on('connect', () => {
                        socket.destroy();
                        resolve();
                    });
                    socket.on('timeout', () => {
                        socket.destroy();
                        reject(new Error('timeout'));
                    });
                    socket.on('error', reject);
                    socket.connect(port, 'localhost');
                });
                this.port = port;
                return port;
            } catch (error) {
                continue;
            }
        }
        return null;
    }

    async fetchModels() {
        try {
            const response = await axios.get(`http://localhost:${this.port}/api/tags`);
            return response.data.models.map(model => model.name);
        } catch (error) {
            console.error('Error fetching Ollama models:', error);
            return [];
        }
    }

    async sendMessage(model, message) {
        try {
            const response = await axios.post(`http://localhost:${this.port}/api/generate`, {
                model: model,
                prompt: message
            },{
                responseType: 'text'
            });

            const lines = response.data.split('\n');

            let finalResponse = '';

            for (const line of lines){
                if(line.trim()){
                    const json = JSON.parse(line);

                    finalResponse += json.response;

                    if(json.done){
                        break;
                    }
                }
            }

            return finalResponse;
        } catch (error) {
            console.error('Error sending message to Ollama:', error);
            return "Error: Unable to get response from Ollama";
        }
    }
}

module.exports = OllamaService;