# ChatGPT Audio Auto-Downloader

A simple JavaScript tool that automatically downloads audio files when using ChatGPT's "Read Aloud" feature.

## How It Works

This script intercepts network requests made by ChatGPT when the "Read Aloud" feature is used, captures the audio data, and automatically downloads it to your computer.

## Installation & Usage

### Quick Start

1. Open ChatGPT in your web browser
2. Open browser's Developer Console:
   - Chrome/Edge: Press F12 or right-click → Inspect → Console
   - Firefox: Press F12 or right-click → Inspect → Console
   - Safari: Enable Developer Tools in preferences, then right-click → Inspect Element → Console
3. Copy and paste the entire script content into the console
4. Press Enter to execute the script
5. Close the console (optional)
6. Use the "Read Aloud" feature on any ChatGPT message
7. The audio will be automatically downloaded to your default downloads folder

### What to Expect

- A small notification box will appear in the bottom-right corner of the screen
- When audio is detected, it will show "Auto-downloading audio..."
- Files are saved with names like "chatgpt-audio-[timestamp].mp3"
- The UI can be hidden by clicking the × button

## Features

- **Automatic Downloads**: No need to click any buttons
- **Manual Option**: Backup download button available if auto-download fails
- **Status Indicators**: Shows when audio is detected and downloaded
- **Minimalist UI**: Can be hidden when not needed

## Troubleshooting

- If downloads don't start automatically, check your browser's download settings
- Some browsers may block automatic downloads; use the manual download button as a fallback
- If no audio is detected, try refreshing the page and running the script again

## Notes

- This script only works on the ChatGPT website
- The script needs to be re-applied each time you refresh the page
- Audio files are saved in MP3 format

## License

This tool is provided as-is for personal use.
