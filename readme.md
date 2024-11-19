# YouTube Summarizer & Outliner

![License](https://img.shields.io/badge/license-MIT-blue)

## Description

The **YouTube Summarizer & Outliner** is a Chrome extension that uses the **Free** GitHub Models API to provide users with a quick and efficient way to summarize, outline, and access transcripts of YouTube videos. This extension offers a streamlined experience to save time and better understand video content without needing to watch the entire video.

This version leverages Webpack to bundle the project's files, improving maintainability and ensuring compatibility with modern browser environments.

### Features

1. **Summarize YouTube Videos:** Generate a concise summary of the main points and key ideas covered in a YouTube video.
2. **Outline YouTube Videos:** Create an organized outline of the video's content, complete with timestamps, highlighting main ideas, arguments, and evidence.
3. **Retrieve Video Transcripts:** Access the video's transcript for reference, searching specific content, or reading alongside the video.
4. **Copy to Clipboard:** Easily copy generated summaries, outlines, or transcripts for sharing or saving.
5. **Timestamp Links:** Click timestamps in the outline or transcript to jump directly to specific parts of the video.
6. **Session Storage:** Retains outcomes of interactions within the current browsing session, ensuring results are accessible until the session ends.

### Changes in this Version

- **GitHub Models API Integration:** Replaces OpenAI with GitHub Models API for summarization and outlining, using the `gpt-4o-mini` model.
- **Webpack Integration:** Uses Webpack to bundle the service worker and other necessary files for enhanced maintainability.

## Installation

To install the updated version of the YouTube Summarizer & Outliner extension:

### Clone the Repository

```bash
git clone -b github-models https://github.com/amir-varkovitzky/YouTube-Summarizer-and-Outliner.git
cd <repository-folder>
```

### Set Up the Environment

1. **Create a `.env` File**:
   - In the project's root directory, create a `.env` file with the following content:

    ```plaintext
    GITHUB_API_KEY=<your-github-personal-access-token>
    ```

   - Replace `<your-github-personal-access-token>` with your actual GitHub Personal Access Token (PAT).

2. **Install Dependencies**:
   - Ensure Node.js is installed on your system, then run:

    ```bash
    npm install
    ```

3. **Bundle the Extension**:
   - Use Webpack to bundle the project files:

    ```bash
    npx webpack
    ```

   - The bundled files will be generated in the `dist` directory.

---

### Load the Extension in Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" in the top right corner.
3. Click "Load unpacked" and select the project directory.
4. The extension will now be installed and visible in your Chrome toolbar.

---

### How to Use

1. Open a YouTube video in your Chrome browser.
2. Click on the extension icon in your Chrome toolbar.
3. In the extension popup, you'll find three buttons: **"Outline"**, **"Summarize"**, and **"Transcript"**.
4. Click the desired button, and the extension will process the video's transcript using the GitHub Models API.
5. Results will be displayed in the popup. Errors (if any) will appear in the popup and DevTools console.
6. Copy content or transcripts to your clipboard by clicking **"Copy to clipboard"**.
7. Click timestamps in the outline to jump directly to specific parts of the video.

---

### Technologies Used

- **JavaScript**: Core programming language for the extension's functionality.
- **Chrome Extension API**: For browser interactions.
- **GitHub Models API**: Utilizes `gpt-4o-mini` for summarization and outlining, requiring a GitHub Personal Access Token.
- **Webpack**: Bundles the project files into a single deployable output.

---

### Project Files

- **manifest.json**: Defines the extension's metadata, permissions, and necessary files.
- **popup.html**: Structure and UI for the extension's popup.
- **popup.css**: Styles for the popup UI.
- **popup.js**: Manages user interactions within the popup and communicates with other scripts.
- **content.js**: Extracts YouTube video details and interacts with the popup and service worker.
- **service-worker.js**: Handles API requests to the GitHub Models API, bundled with Webpack.
- **webpack.config.js**: Configures Webpack for bundling the extension's files.
- **LICENSE**: Contains licensing information.
- **README.md**: This file, explaining the project and how to use it.

---

### How to Switch Between Versions

To switch between the original (OpenAI-based) and updated (GitHub Models API) versions:

1. Clone the desired branch from the repository:
   - **main** for OpenAI.
   - **github-models** for this version.

2. Follow the respective installation instructions for the branch.

---

### Credits

This updated version was developed by Amir Varkovitzky, adapted from the original CS50x final project.

---

### License

This project is licensed under the MIT License. For more details, refer to the [LICENSE](LICENSE) file.

---

Enjoy saving time and gaining insights into YouTube content with ease using the **YouTube Summarizer & Outliner** extension!
