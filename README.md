# ChatLLM Reverse Enter

A tiny browser extension (Chrome / Chromium / Firefox) that **reverses the Enter behavior** in the Abacus.AI ChatLLM chat box:

- **Enter** → inserts a newline (lets you write multi-line prompts comfortably)
- **Shift + Enter** → submits the prompt

This is useful when you write longer or more structured prompts and don’t want to accidentally send them by hitting Enter too early.

---

## How it works

The extension injects a content script on the ChatLLM app (`https://apps.abacus.ai/*`) and:

1. Locates the main chat textarea inside the element with `data-id="prependMsg"`.
2. Intercepts `keydown` events on that textarea:
   - Blocks the app’s default Enter behavior.
   - On **plain Enter**:
     - Manually inserts a `\n` at the cursor position.
     - Dispatches an `input` event so the React/Vue app updates its internal state.
   - On **Shift + Enter**:
     - Prevents the newline.
     - Triggers the same send action as clicking the send button (or calling the `ul()` function when available).

Because the ChatLLM UI is a SPA and may render the textarea asynchronously, the script uses a combination of:

- A short polling loop on load (up to ~20 seconds)
- A `MutationObserver` to re-attach if the textarea is recreated

---

## Installation (Chrome / Edge / Brave)

1. Clone this repository:

 git clone https://github.com/cclambie/ChatLLM-Reverse-Enter.git
cd ChatLLM-Reverse-Enter


2. Open Chrome and go to:

chrome://extensions


3. Turn on **Developer mode** (top-right toggle).
4. Click **"Load unpacked"**.
5. Select the `ChatLLM-Reverse-Enter` folder.

The extension should now appear in your extensions list.

---

## Files

- `manifest.json`  
Chrome Manifest V3 definition for the extension.  
- Matches `https://apps.abacus.ai/*`  
- Injects `content.js` as a content script at `document_idle`.

- `content.js`  
Content script that:
- Finds the ChatLLM input textarea (`div[data-id="prependMsg"] textarea`).
- Intercepts `keydown` events.
- Implements:
 - **Enter** → newline
 - **Shift + Enter** → submit (via send button / `ul()`)

---

## Usage

1. Make sure the extension is loaded.
2. Open Abacus.AI ChatLLM (e.g. `https://apps.abacus.ai/chatllm/...`).
3. In the chat input:
- Press **Enter** → a newline should be inserted (no message sent).
- Press **Shift + Enter** → the message should be submitted without adding a newline.

If it doesn't work, open DevTools → **Console** and look for log messages starting with `SHIFTENTER:` for debugging.

---

## Development

After making changes to `manifest.json` or `content.js`:

1. Go to `chrome://extensions`.
2. Click **Reload** on the `ChatLLM Reverse Enter` extension.
3. Reload the ChatLLM tab.

You can add additional logging with `console.log('SHIFTENTER: ...')` in `content.js` to inspect behavior.

---

## License

MIT

---
