let videoID = '';
document.addEventListener("DOMContentLoaded", function () {

    // Check if the current tab is a YouTube video, if not, let the user know
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

        if (!tabs[0].url.includes("youtube.com/watch")) {
            console.log("Please open a YouTube video and try again.");
            const popupWindows = document.getElementsByClassName("popupWindow");
            if (popupWindows.length > 0) {
                popupWindows[0].innerHTML = `<div class="padding-top">Please open a YouTube video and try again.</div>`;
            }
        }
        else {
            videoID = tabs[0].url.match(/[?&]v=([^&#]+)/)[1];
            console.log("videoID:", videoID);
        }
    });

    document.getElementById("outlineButton").addEventListener("click", outline);
    document.getElementById("summarizeButton").addEventListener("click", summarize);
    document.getElementById("transcriptButton").addEventListener("click", getTranscript);
});

// Check if the request was already made, and the response is saved in session storage
function checkSessionStorage(key) {
    chrome.storage.session.get(["sessionData"], function (result) {

        // Check if "sessionData" exists in the result
        if (result.sessionData) {
            // Parse the JSON string to obtain the actual data
            const sessionData = JSON.parse(result.sessionData);
            const sessionVideoID = sessionData.find(data => data.videoID).videoID;

            // If the video ID matches, find the relevant data for the specified key
            if (sessionVideoID === videoID && sessionData.find(data => data.hasOwnProperty(`${key}-result`))) {
                console.log(`${key}-result found in session storage`);
                let resultValue = sessionData.find(data => data[`${key}-result`])[`${key}-result`];
                let copyText = sessionData.find(data => data[`${key}-copy`])[`${key}-copy`];

                // Display the result
                displayResult(`<u><b>${key}</b></u>\n${resultValue}`);
                // Add copy button at the end of the result
                addCopyButton(copyText);
            }
            else {
                console.log(`${key}-result not found in session storage, or the video ID does not match`);
                // If the video ID does not match, send a message to the content script to get the result
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: key });
                });
            }

        }
        else {
            console.log(`${key}-result not found in session storage`);
            // Handle the case when the result is not found, and send a message to the content script to get the result
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: key });
            });
        }
    });
}

// Add a copy button to the end of the result, add a click event listener to the timestamp link, and send a message to the content script to open the video at the timestamp
function addCopyButton(copyText) {

    // Create a new button
    let copyButton = document.createElement("button");
    copyButton.innerHTML = "Copy to clipboard";
    copyButton.id = "copyButton";

    copyButton.addEventListener("click", function () {
        navigator.clipboard.writeText(copyText);
        copyButton.innerHTML = "Copied!";
        copyButton.style.backgroundColor = "green";
        console.log("Copied to clipboard:", copyText.length > 20 ? copyText.substring(0, 10) + ' ... ' + copyText.substring(copyText.length - 10) : copyText);
    });

    // Add a click event listener to the timestamp link, and send a message to the content script to open the video at the timestamp
    document.querySelectorAll(".link").forEach(linkElement => {
        linkElement.addEventListener("click", function () {
            const timestamp = this.getAttribute("data-timestamp");
            console.log("Clicked on timestamp:", timestamp);
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "link", linkTime: timestamp });
            });
            this.style.color = "red";
        });
    });

    // Get the button container and append the new button to it
    let buttonContainer = document.getElementById("buttonContainer");
    // Clear existing copy button
    buttonContainer.lastChild.remove();
    buttonContainer.appendChild(copyButton);
}

// Initialize an empty array to hold your data
let sessionData = [];
// Add data to the session stored array
function addToSessionArray(keyValuePairs) {

    for (const pair of keyValuePairs) {
        const [key, value] = pair;
        sessionData.push({ [key]: value });
    }

    // Serialize the data to JSON before storing in session storage
    const serializedData = JSON.stringify(sessionData);
    chrome.storage.session.set({ sessionData: serializedData }, function () {
        console.log(`Data added to session storage: `, keyValuePairs);
    });
}

// Display error messages in the message container as HTML
function displayError(error) {

    // Check if the content div already exists
    const existingContainer = document.getElementById("content");
    if (existingContainer) {
        // If it exists, remove it from the document
        document.body.removeChild(existingContainer);
    }

    // Create a container div
    const container = document.createElement("div");
    container.id = "content";

    // Display the error message in the message container
    container.innerHTML = `<div class="error">${error}</div>`;

    // Get a reference to the script tag
    const scriptTag = document.querySelector('script[src="popup.js"]');

    // Insert the container before the script tag
    document.body.insertBefore(container, scriptTag);
}

// Format the result according to the action
function fromatResult(action, result) {

    // Generate links to the video from the timestamps
    function linkToTimestamps(result) {
        result = result.replace(/(\d+:\d+:\d+)|(\d+:\d+)/g, (match) => {
            let [hours, minutes, seconds] = [0, 0, 0];

            if (/\d+:\d+/.test(match) && !(/\d+:\d+:\d+/.test(match))) { // Check if the match is in the "m:s" format
                [minutes, seconds] = match.split(':').map(Number);
            }
            else if (/\d+:\d+:\d+/.test(match)) { // Check if the match is in the "h:m:s" format
                [hours, minutes, seconds] = match.split(':').map(Number);
            }
            let timeInSeconds = (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0); // Convert the timestamp to seconds

            return `<div class="link" data-timestamp="#t=${timeInSeconds}s">${match.replace(/\n+/g, ' ')}</div>`; // Wrap the timestamp in a <div> and add a class of "link" to it
        });
        return result;
    }

    if (action === "transcript") {
        result = linkToTimestamps(result)
        result = result.replace(/(^|\n)([^0-9:\n]+)\n/g, '$1<b>$2</b>\n') // Regular expression to add <b> around headers, which are lines of text not preceded by a timestamp (now wrapped in <a> tags)
        // Use a regular expression to match each pair of anchor tags and text
        const regex = /<div[^>]*>.*?<\/div>[^<]*/g;
        // Wrap each match in a <div>
        result = result.replace(regex, (match) => {
            return `<div class="d-flex">${match}</div>`;
        });
        return result;
    }

    if (action === "outline") {
        result = linkToTimestamps(result)
        result = result.replace(/\n+/g, '\n') // Regular expression pattern to replace 2 or more newline characters (\n) with a single newline character (\n)
            .split('\n')
            .map(item => `<div class="d-flex">${item}</div>`) // Wrap each line in a <div>
            .join('');
        return result;
    }

    if (action === "summary") {
        return `<div>${result}</div>`;
    }
}

// Display messages in the message container as text
function displayResult(result) {

    // Check if the content div already exists
    const existingContainer = document.getElementById("content");
    if (existingContainer) {
        // If it exists, remove it from the document
        document.body.removeChild(existingContainer);
    }

    // Create a container div
    const container = document.createElement("div");
    container.id = "content";

    // Display the result in the message container
    container.innerHTML = `<div id="result" class="result">${result}</div>`;

    // Get a reference to the script tag
    const scriptTag = document.querySelector('script[src="popup.js"]');

    // Insert the container before the script tag
    document.body.insertBefore(container, scriptTag);
}

// Show the loading spinner
function showLoadingSpinner() {

    // Check if the content div already exists
    const existingContainer = document.getElementById("content");
    if (existingContainer) {
        // If it exists, remove it from the document
        document.body.removeChild(existingContainer);
    }

    // Create a container div
    const container = document.createElement("div");
    container.id = "content";

    // Display the loading spinner in the message container
    container.innerHTML =
        `<div id="loadingspinner" class="loading">
        <div class="loader"></div>
        </div>`;

    // Get a reference to the script tag
    const scriptTag = document.querySelector('script[src="popup.js"]');

    // Insert the container before the script tag
    document.body.insertBefore(container, scriptTag);

    // Set the display style of the loading spinner
    document.getElementById("loadingspinner").style.display = "flex";
}

// Listen for messages sent from the background script or content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "outline" || message.action === "summary") {
        if (message.result) {
            console.log(`Action: ${message.action} passed successfully`)
            // Format the result according to the action
            let result = fromatResult(message.action, message.result);

            // Display the result
            displayResult(`<u><b>${message.action}</b></u>\n${result}`);

            // Save the result to session storage 
            // Save the result before formatting to session storage for copy button
            // Save the current video ID to session storage
            addToSessionArray([[`${message.action}-result`, result], [`${message.action}-copy`, message.result], ["videoID", videoID]]);

            //add copy button at the end of the result, add a click event listener to the timestamp link, and send a message to the content script to open the video at the timestamp
            addCopyButton(message.result);

        } else if (message.error) {
            // Display the error message in the message container
            displayError(message.error);
        }
    } else if (message.action === "transcript") {
        if (message.transcript) {
            console.log(`Action: ${message.action} passed successfully`)
            // Format the transcript and generate links to the video from the timestamps
            let result = fromatResult(message.action, message.transcript);
            // Display the transcript in the message container
            displayResult(`<u><b>Transcript</b></u>\n${result}`);

            // Save the result to session storage 
            // Save the result before formatting to session storage for copy button
            // Save the current video ID to session storage
            addToSessionArray([[`${message.action}-result`, result], [`${message.action}-copy`, message.transcript], ["videoID", videoID]]);

            //add copy button at the end of the transcript, add a click event listener to the timestamp link and send a message to the content script to open the video at the timestamp
            addCopyButton(message.transcript);

        } else if (message.error) {
            // Display the error message in the message container
            displayError(message.error);
        }
    }
});

function outline() {
    let copyButton = document.getElementById("buttonContainer").lastChild;
    if (copyButton.id === "copyButton") { // Check if the copy button already exists
        copyButton.hidden = true;
    }
    showLoadingSpinner();
    checkSessionStorage("outline");
}

function summarize() {
    let copyButton = document.getElementById("buttonContainer").lastChild;
    if (copyButton.id === "copyButton") { // Check if the copy button already exists
        copyButton.hidden = true;
    }
    showLoadingSpinner();
    checkSessionStorage("summary");
}

function getTranscript() {
    let copyButton = document.getElementById("buttonContainer").lastChild;
    if (copyButton.id === "copyButton") { // Check if the copy button already exists
        copyButton.hidden = true;
    }
    showLoadingSpinner();
    checkSessionStorage("transcript");
}
