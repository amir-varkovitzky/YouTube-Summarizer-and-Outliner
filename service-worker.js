const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Function to send the transcript to OpenAI API for summarization or outlining
async function sendTranscriptToOpenAI(transcript, action) {
  let outline = 'Outline the provided text. your response must include timestamps, and highlight main ideas, arguments, and evidence with clear headings and subheadings.';
  let summarize = 'Summarize the provided text, capturing its main ideas, key arguments, and supporting evidence in a clear, concise and comprehensive manner.';
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        'model': 'gpt-3.5-turbo-16k',
        'messages': [
          {
            'role': 'system',
            'content': action === "outline" ? outline : summarize
          },
          {
            'role': 'user',
            'content': transcript
          }
        ],
        'temperature': 0,
        'max_tokens': 10000,
        'top_p': 1,
        'frequency_penalty': 0,
        'presence_penalty': 0
      }),
    };

    const response = await fetch(OPENAI_API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Error sending transcript to OpenAI: ${data.error.message}\nstatus ${response.status}`);
    }

    const result = data.choices[0].message.content;

    console.log(`Sending result to popup - Action: ${action}`);
    chrome.runtime.sendMessage({ action, result }); // Send result to popup
  } catch (error) {
    console.error(error);
    chrome.runtime.sendMessage({ action, error: error.message }); // Send error message to popup
  }
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "outline" || message.action === "summary") {
    console.log("Message received from content script:", message.action);
    if (!message.transcript) {
      console.error('Error: Transcript not found');
      return;
    }
    console.log("sending transcript to OpenAI:", `\n${message.transcript}`);
    sendTranscriptToOpenAI(message.transcript, message.action);
  }
});
