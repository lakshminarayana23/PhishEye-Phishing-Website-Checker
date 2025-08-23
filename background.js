function updateCurrentUrl(url, tabId) {
  chrome.storage.local.set({ currentUrl: url, tabId });
  
  // optional: update badge text
  chrome.action.setBadgeText({ text: "CHK", tabId });
  chrome.action.setBadgeBackgroundColor({ color: "blue", tabId });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    updateCurrentUrl(tab.url, tabId);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  let tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab && /^http/.test(tab.url)) {
    updateCurrentUrl(tab.url, tab.id);
  }
});
