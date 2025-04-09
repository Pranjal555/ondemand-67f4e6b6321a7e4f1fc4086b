
const axios = require('axios');

// Replace these placeholders with your actual values
const API_KEY = '<replace_api_key>';
const EXTERNAL_USER_ID = '<replace_external_user_id>';
const QUERY = 'Put your query here';
const PLUGIN_IDS = [
  'plugin-1712327325',
  'plugin-1713962163',
  'plugin-1716164040',
  'plugin-1722504304',
  'plugin-1713954536',
  'plugin-1713958591',
  'plugin-1713958830',
  'plugin-1713961903',
  'plugin-1713967141'
];

// Function to create a chat session
async function createChatSession() {
  const url = 'https://api-dev.on-demand.io/chat/v1/sessions';
  const headers = { apikey: API_KEY };
  const body = {
    pluginIds: [],
    externalUserId: EXTERNAL_USER_ID
  };

  try {
    const response = await axios.post(url, body, { headers });
    if (response.status === 201) {
      return response.data.data.id; // Extract session ID
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Error creating chat session:', error.message);
    throw error;
  }
}

// Function to submit a query
async function submitQuery(sessionId, responseMode = 'sync') {
  const url = `https://api-dev.on-demand.io/chat/v1/sessions/${sessionId}/query`;
  const headers = { apikey: API_KEY };
  const body = {
    endpointId: 'predefined-openai-gpt4o',
    query: QUERY,
    pluginIds: PLUGIN_IDS,
    responseMode,
    reasoningMode: 'medium'
  };

  if (responseMode === 'sync') {
    try {
      const response = await axios.post(url, body, { headers });
      if (response.status === 200) {
        console.log('Query Response:', response.data);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting query:', error.message);
      throw error;
    }
  } else if (responseMode === 'stream') {
    try {
      const response = await axios({
        method: 'post',
        url,
        headers,
        data: body,
        responseType: 'stream'
      });

      response.data.on('data', (chunk) => {
        const data = chunk.toString();
        console.log('Streamed Data:', data);
      });

      response.data.on('end', () => {
        console.log('Stream ended.');
      });

      response.data.on('error', (error) => {
        console.error('Stream error:', error.message);
      });
    } catch (error) {
      console.error('Error submitting query in stream mode:', error.message);
      throw error;
    }
  } else {
    throw new Error('Invalid responseMode. Use "sync" or "stream".');
  }
}

// Main function to execute the flow
(async () => {
  try {
    const sessionId = await createChatSession();
    console.log('Chat Session ID:', sessionId);

    // Submit query in sync mode
    await submitQuery(sessionId, 'sync');

    // Uncomment the following line to test in stream mode
    // await submitQuery(sessionId, 'stream');
  } catch (error) {
    console.error('Error in main flow:', error.message);
  }
})();
