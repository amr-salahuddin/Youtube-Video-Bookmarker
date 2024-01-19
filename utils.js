export async function getCurrentTab() {
    const queryOptions = {active: true, currentWindow: true};
    console.log('fsadfsadfsdafsadfasd');
    const [tab] = await chrome.tabs.query(queryOptions);
        return tab;
}


export async function fetchBookmarks(videoId) {
    const tmpBookmarks = await chrome.storage.sync.get([videoId]);
    let videoBookmarks = tmpBookmarks[videoId] ? tmpBookmarks[videoId] : '[]';
    videoBookmarks = JSON.parse(videoBookmarks);
    console.log(videoBookmarks)
    return videoBookmarks;
}

