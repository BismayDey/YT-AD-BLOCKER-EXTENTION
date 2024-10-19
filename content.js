// content.js
const defaultSelectors = [
  "ytd-display-ad-renderer",
  "ytd-promoted-sparkles-web-renderer",
  "ytd-ad-slot-renderer",
];

// Function to remove ads and log the count
function removeAds() {
  chrome.storage.sync.get(
    ["adBlockingEnabled", "customSelectors", "blockedAds"],
    (data) => {
      if (data.adBlockingEnabled) {
        const adSelectors = [
          ...defaultSelectors,
          ...(data.customSelectors || []),
        ];
        let blockedCount = 0;
        const blockedAdsList = [];

        adSelectors.forEach((selector) => {
          const ads = document.querySelectorAll(selector);
          ads.forEach((ad) => {
            ad.remove();
            blockedCount++;
            blockedAdsList.push(selector); // Log the selector used for blocking
          });
        });

        if (blockedCount > 0) {
          console.log(`Blocked ${blockedCount} ads.`);
          // Save the blocked ads log
          chrome.storage.sync.get("blockedAds", (storedData) => {
            const updatedBlockedAds = [
              ...(storedData.blockedAds || []),
              ...blockedAdsList,
            ];
            chrome.storage.sync.set({ blockedAds: updatedBlockedAds });
          });
        }
      }
    }
  );
}

// Observe for changes in the DOM to catch ads that may load dynamically
const observer = new MutationObserver(removeAds);
observer.observe(document.body, { childList: true, subtree: true });

// Initial call to remove any ads already present
removeAds();

// Block ads when a video is opened
const videoObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.matches("ytd-watch-flexy")
        ) {
          removeAds();
        }
      });
    }
  });
});

videoObserver.observe(document.body, { childList: true, subtree: true });
