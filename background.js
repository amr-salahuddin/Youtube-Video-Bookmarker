chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(tab.url && tab.url.includes("youtube.com/watch")){
        let tmpUrl = tab.url.split('?')[1];
        let urlParams = new URLSearchParams(tmpUrl);
        let videoId = urlParams.get('v');
        chrome.tabs.sendMessage(tabId, {
            type:"NEW",
           videoId: videoId,
            time:-1
        });
    }
})