// content.js
(function () {
  console.log('SHIFTENTER: Script loaded');

  function attachHandler(textarea) {
    if (window.__shiftEnterAttached) {
      console.log('SHIFTENTER: Handler already attached globally');
      return;
    }

    console.log('SHIFTENTER: Attaching handler to textarea');
    window.__shiftEnterAttached = true;

    textarea.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        // Always block native Enter so app can't auto-submit
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (e.shiftKey) {
          // Shift+Enter -> submit
          console.log('SHIFTENTER: Shift+Enter -> submit');

          try {
            // Try global function first, if it ever exists
            if (typeof window.ul === 'function') {
              window.ul();
              console.log('SHIFTENTER: Called window.ul()');
            } else {
              console.log('SHIFTENTER: window.ul not found, clicking send button');
              // Use your actual send button selector
              const sendButton =
                document.querySelector('button[data-id="send"]') ||
                document.querySelector('button[data-id="sendMsg"]') ||
                document.querySelector('button[aria-label="Send"], button[type="submit"]');

              if (sendButton) {
                sendButton.click();
                console.log('SHIFTENTER: Clicked send button');
              } else {
                console.log('SHIFTENTER: Send button not found');
              }
            }
          } catch (err) {
            console.error('SHIFTENTER: Error submitting', err);
          }

          return false;
        } else {
          // Plain Enter -> manually insert newline
          console.log('SHIFTENTER: Enter -> inserting newline manually');

          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const value = textarea.value;

          textarea.value = value.substring(0, start) + '\n' + value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 1;

          // Let the framework know value changed
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.dispatchEvent(new Event('change', { bubbles: true }));

          return false;
        }
      }
    }, true); // capture
  }

  function findAndAttach() {
    // Already attached somewhere? Don't do anything
    if (window.__shiftEnterAttached) {
      return true;
    }

    const textarea = document.querySelector('div[data-id="prependMsg"] textarea');
    if (textarea) {
      attachHandler(textarea);
      return true;
    }
    return false;
  }

  // Initial attempt + polling
  if (!findAndAttach()) {
    let attempts = 0;
    const maxAttempts = 40;
    const interval = setInterval(() => {
      attempts++;
      if (findAndAttach() || attempts >= maxAttempts) {
        clearInterval(interval);
        console.log(`SHIFTENTER: Stopped retrying (attached=${!!window.__shiftEnterAttached}, attempts=${attempts})`);
      }
    }, 500);
  }

  // Watch for SPA re-renders – only attaches once due to global flag
  const observer = new MutationObserver(() => {
    findAndAttach();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('SHIFTENTER: MutationObserver active');
})();