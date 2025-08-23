async function checkUrl(url, tabId = null) {
  const resultDiv = document.getElementById("result");
  const bannerDiv = document.getElementById("banner");

  resultDiv.textContent = "Checking...";
  resultDiv.className = "result-card error";
  bannerDiv.innerHTML = "";

  try {
    const response = await fetch("https://link-checker.nordvpn.com/v1/public-url-checker/check-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://nordvpn.com"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (data.category === 1) {
      resultDiv.innerHTML = `Safe Website<div class="url">${data.url}</div>`;
      resultDiv.className = "result-card safe";
    } else if (data.category === 3) {
      resultDiv.innerHTML = `Phishing/Malicious<div class="url">${data.url}</div>`;
      resultDiv.className = "result-card phishing";
      bannerDiv.innerHTML = `<div class="banner banner-danger">⚠ WARNING: This site may be dangerous!</div>`;
    } else {
      resultDiv.innerHTML = `Unknown Result<div class="url">${data.url}</div>`;
      resultDiv.className = "result-card unknown";
    }
  } catch (err) {
    resultDiv.textContent = "Error checking URL";
    resultDiv.className = "result-card error";
  }
}

// 🔹 Load last known URL on popup open
chrome.storage.local.get(["currentUrl", "tabId"], (data) => {
  if (data.currentUrl) {
    checkUrl(data.currentUrl, data.tabId);
  }
});

// 🔹 React to background updates
chrome.storage.onChanged.addListener((changes) => {
  if (changes.currentUrl) {
    checkUrl(changes.currentUrl.newValue);
  }
});

// 🔹 Manual input handler
document.getElementById("checkManual").addEventListener("click", async () => {
  const manualUrl = document.getElementById("manualUrl").value.trim();
  if (manualUrl) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    checkUrl(manualUrl, tab.id);
  }
});
