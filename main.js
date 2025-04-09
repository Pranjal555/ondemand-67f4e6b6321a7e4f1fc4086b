```javascript
const axios = require('axios');

// Replace these values with your actual API key and external user ID
const API_KEY = '<replace_api_key>';
const EXTERNAL_USER_ID = '<replace_external_user_id>';

// Function to create a chat session
async function createChatSession() {
    const url = 'https://api-dev.on-demand.io/chat/v1/sessions';
    const headers = { 'apikey': API_KEY };
    const body = {
        pluginIds: [],
        externalUserId: EXTERNAL_USER_ID
    };

    try {
        const response = await axios.post(url, body, { headers });
        if (response.status === 201) {
            console.log('Chat session created successfully:', response.data);
            return response.data.id; // Extract session ID
        } else {
            console.error('Unexpected status code:', response.status);
        }
    } catch (error) {
        console.error('Error creating chat session:', error.response ? error.response.data : error.message);
    }
}

// Function to submit a query
async function submitQuery(sessionId, query, responseMode = 'sync') {
    const url = `https://api-dev.on-demand.io/chat/v1/sessions/${sessionId}/query`;
    const headers = { 'apikey': API_KEY };
    const body = {
        endpointId: 'predefined-openai-gpt4o',
        query: query,
        pluginIds: [
            'plugin-1712327325',
            'plugin-1713962163',
            'plugin-1716164040',
            'plugin-1722504304',
            'plugin-1713954536',
            'plugin-1713958591',
            'plugin-1713958830',
            'plugin-1713961903',
            'plugin-1713967141'
        ],
        responseMode: responseMode,
        reasoningMode: 'medium'
    };

    try {
        if (responseMode === 'sync') {
            const response = await axios.post(url, body, { headers });
            if (response.status === 200) {
                console.log('Query response:', response.data);
            } else {
                console.error('Unexpected status code:', response.status);
            }
        } else if (responseMode === 'stream') {
            const response = await axios({
                method: 'post',
                url: url,
                headers: headers,
                data: body,
                responseType: 'stream'
            });

            response.data.on('data', (chunk) => {
                const data = chunk.toString();
                console.log('Streaming response chunk:', data);
            });

            response.data.on('end', () => {
                console.log('Streaming response completed.');
            });

            response.data.on('error', (error) => {
                console.error('Error during streaming:', error.message);
            });
        }
    } catch (error) {
        console.error('Error submitting query:', error.response ? error.response.data : error.message);
    }
}

// Main function to demonstrate API usage
async function main() {
    const sessionId = await createChatSession();
    if (sessionId) {
        const query = 'Put your query here';
        await submitQuery(sessionId, query, 'sync'); // Change 'sync' to 'stream' for streaming response
    }
}

main();
```