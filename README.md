# YouTube Summarizer & Outliner

## Video Demo: [Watch the Demo](<https://youtu.be/m0dFbdwfOgc>)

## Description

The **YouTube Summarizer & Outliner** is a Chrome extension that harnesses the power of AI to provide users with a quick and efficient way to summarize, outline, and access transcripts of YouTube videos. With this extension, users can save time and gain a better understanding of video content without having to watch the entire video. Here's a detailed explanation of the project:

### Features

1. **Summarize YouTube Videos:** Click the "Summarize" button to generate a concise summary of the main points and key ideas covered in a YouTube video. This feature is especially helpful when you want to quickly grasp the content of lengthy videos.

2. **Outline YouTube Videos:** Click the "Outline" button to create an organized outline of the video's content, complete with timestamps. The extension identifies main ideas, arguments, and evidence, making it easier to navigate and comprehend the video's structure.

3. **Retrieve Video Transcripts:** Click the "Transcript" button to access the video's transcript. This transcript can be valuable for reference, searching for specific content, or reading along while watching the video.

4. **Copy to Clipboard:** Easily copy the generated summaries, outlines, or transcripts to your clipboard with the click of a button. This feature streamlines the process of sharing or saving information.

5. **Timestamp Links:** In the generated outline or transcript, you can click on timestamps to instantly jump to specific parts of the video. This allows you to directly access the relevant content.

6. **Session storing:** The extension retains the outcomes of your interactions within the current extension's session, allowing you to access them until you refresh the extension, use it for another video, or close the browser. This feature ensures that your generated summaries, outlines, or transcripts remain conveniently accessible during your browsing session. The reason I went with session storage instead of local storage, is to avoid requesting further permsissions, and to prevent potential data inconsistencies stemming from older videos.

### Installation

To install the YouTube Summarizer & Outliner extension, follow these simple steps:

1. Download or clone the project repository to your local machine.

2. Open the folder, open the service-worker.js file, and in the first line, replace the value of `const OPENAI_API_KEY` with your own OpenAI API key.

3. Open Google Chrome and navigate to `chrome://extensions/`.

4. Enable "Developer mode" in the top right corner of the Extensions page.

5. Click on the "Load unpacked" button and select the directory where you downloaded or cloned the extension files.

6. The extension will now be installed and visible in your Chrome toolbar.

### How to Use

Using the YouTube Summarizer & Outliner is straightforward:

1. Open a YouTube video in your Chrome browser.

2. Click on the extension icon in your Chrome toolbar.

3. In the extension popup, you'll find three buttons: "Outline," "Summarize," and "Transcript."

4. Click the desired button, and the extension will start processing the video's transcript.

5. Once processing is complete, you'll see the results displayed in the popup. In the event of an error, a detailed error message will appear in the extension popup, as well as in the popup DevTools console.

6. To copy the generated content or transcript to your clipboard, click the "Copy to clipboard" button.

7. Timestamps in the outline are clickable, allowing you to jump to specific parts of the video.

### Technologies Used

- **JavaScript:** The core language used for the extension's functionality.
- **Chrome Extension API:** Leveraged to create the extension and interact with the browser.
- **OpenAI API:** GPT-3.5 Turbo 16k used for text summarization and outlining. Please note that during the demo, I used the API key given with an OpenAI API free trial, GPT-3.5 Turbo 16k. However, with a paid API key, the limitations are lifted, enabling the extension to handle much lengthier videos.

## Project Files

Here's a brief overview of the files included in this project and their respective roles:

- **manifest.json:** This file is essential for Chrome extensions. It contains metadata about the extension, such as its name, version, permissions, and the location of the extension's different necessary files. In this project it, among other things, specifies the icons and permissions required, such as storage, which is required for storing session data.

- **popup.html:** This HTML file defines the structure and content of the extension's popup when you click on the extension icon in the Chrome toolbar. It includes buttons for "Outline," "Summarize," and "Transcript," and it displays the results generated by the extension, as well as errors if there are such.

- **popup.css:** This css file is responsible for defining the styles and layout of the extension's popup user interface. It plays a crucial role in ensuring that the popup is visually appealing and user-friendly. By defining elements such as fonts, colors, margins, padding, and positioning, popup.css helps create a consistent and aesthetically pleasing design.

- **popup.js:** This JavaScript file provides the functionality for the extension's popup. It handles user interactions, such as button clicks, and communicates with the content script to process YouTube videos and display the results in the popup.

- **content.js:** This content script is injected into the YouTube video page when the extension is activated. It interacts with the YouTube video player, captures video details, and communicates with both the popup.js and service-worker.js script to trigger the AI-powered summarization, outlining, and transcript retrieval.

- **service-worker.js:** The service worker is responsible for handling requests and background tasks. In this project, it manages communication with the OpenAI API for text summarization and outlining. You'll find your OpenAI API key configured in this file.

- **LICENSE:** This file contains the licensing information for the project. It's licensed under the MIT License.

- **README.md:** The file you're currently reading, which provides detailed information about the project, installation instructions, and an overview of each project file.

### Credits

This extension was developed by Amir Varkovitzky, as the final project of the CS50x course.

### License

This project is licensed under the MIT License. For more details, refer to the [LICENSE](/LICENSE) file.

I hope you find the YouTube Summarizer & Outliner extension useful for enhancing your video-watching experience. Enjoy saving time and gaining insights into YouTube content with ease!
