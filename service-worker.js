import OpenAI from "openai";

const token = process.env.GITHUB_TOKEN; // Token is loaded from .env during build
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o-mini";

// Function to send the transcript to GitHub Models API for summarization or outlining
async function sendTranscriptToGitHubModels(transcript, action) {
  const outline =
    "Outline the provided text. your response must highlight main ideas, arguments, and evidence with clear headings and subheadings, each of which must include timestamps. provide the output as plain text, with no Markdown formatting.";
  const summarize =
    "Summarize the provided text, capturing its main ideas, key arguments, and supporting evidence in a clear, concise and comprehensive manner. provide the output as plain text, with no Markdown formatting. You may use bullet points or numbered lists to organize your response.";

  try {
    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: action === "outline" ? outline : summarize },
        { role: "user", content: transcript },
      ],
      model: modelName,
      temperature: 1.0,
      max_tokens: 1000,
      top_p: 1.0,
    });

    const result = response.choices[0].message.content;

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
      console.error("Error: Transcript not found");
      return;
    }
    console.log(
      "sending transcript to GitHub Models:",
      `\n${message.transcript}`
    );
    sendTranscriptToGitHubModels(message.transcript, message.action);
  }
});
