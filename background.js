// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log("YouTube Ad Blocker installed!");
  // Set default setting for ad blocking (enabled by default)
  chrome.storage.sync.set({
    adBlockingEnabled: true,
    customSelectors: [],
    blockedAds: [],
  });
});

// Optionally, handle messages to toggle ad blocking
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleAdBlocking") {
    chrome.storage.sync.get("adBlockingEnabled", (data) => {
      const newStatus = !data.adBlockingEnabled;
      chrome.storage.sync.set({ adBlockingEnabled: newStatus });
      sendResponse({ adBlockingEnabled: newStatus });
    });
    return true; // Indicate that the response will be sent asynchronously
  }
});
