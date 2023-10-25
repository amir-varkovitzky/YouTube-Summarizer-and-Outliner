console.log("content script loaded");

// Get the transcript from the youtube page
function getTranscript() {
  return new Promise((resolve, reject) => {
    let counter = 0;

    const fetchTranscript = async () => {
      const showTranscriptButton = document.querySelector('[aria-label="Show transcript"]');
      const transcriptBox = document.querySelector("#segments-container");

      // Check if the transcript button is available, if not, return an error
      if (!showTranscriptButton) {
        reject('Error: Transcript button not found');
        return;
      }

      // Open the transcript box
      showTranscriptButton.click();

      // Check if the transcript box is available, if not, wait 1 second and check again
      if (transcriptBox) {
        console.log("Transcript box found");
        const inputText = transcriptBox.innerText;

        let transcript = inputText.replace(/ {2,}/g, '\n') // Regular expression pattern to replace 2 or more spaces with a newline character (\n)
          .replace(/\n+/g, '\n') // Regular expression pattern to replace 2 or more newline characters (\n) with a single newline character (\n)
          .replace(/(?<=\d+:\d+)\n/g, ' ') // Regular expression pattern to To eliminate newline characters (\n) when they are preceded by a timestamp, and replace them with a space.
          .trim() // Remove leading and trailing whitespace

        // Remove \n at the beginning of the transcript
        if (transcript.startsWith('\n')) {
          transcript = transcript.slice(1);
        }

        // Close the transcript box after 100 milliseconds, otherwise, it will not close
        setTimeout(() => {
          document.querySelector('[aria-label="Close transcript"]').click();
        }, 100);

        resolve(transcript); // Resolve the promise with the transcript data
      } else {
        console.log("Waiting for transcript box...");
        console.log(counter);

        // If the transcript box is not available, wait 1 second and check again for a maximum of 10 times
        if (counter === 10) {
          reject('Error: Transcript box not found');
          return;
        }

        counter++;
        setTimeout(fetchTranscript, 1000); // Check again after 1 second
      }
    };
    fetchTranscript(); // Start the process
  });
}

// listen for messages from the popup
chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  if (message.action === "transcript") {
    console.log("Message received from popup", message.action);
    try {
      const transcript = await getTranscript();
      chrome.runtime.sendMessage({ action: message.action, transcript });
    } catch (error) {
      console.error(error);
      // Send the error message to the popup script
      chrome.runtime.sendMessage({ action: message.action, error: error });
    }
  } else if (message.action === "outline" || message.action === "summary") {
    console.log("Message received from popup:", message.action);
    try {
      const transcript = await getTranscript();
      console.log("sending transcript to OpenAI");

      // Send the message object with the transcript
      chrome.runtime.sendMessage({ action: message.action, transcript });
      console.log("Message sent to service-worker.js", message.action);
    } catch (error) {
      console.error(error);
      // Send the error message to the popup script
      chrome.runtime.sendMessage({ action: message.action, error: error });
    }
  }
  else if (message.action === "link") {
    console.log("Message received from popup", message.action, message.linkTime);
    window.location.replace(message.linkTime, '_self');
  }
});
