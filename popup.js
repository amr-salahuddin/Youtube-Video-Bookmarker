import {getCurrentTab, fetchBookmarks} from "./utils.js";

// adding a new bookmark row to the popup
const addNewBookmark = async (bookmark, bookmarksContainer, videoId) => {
    //BOOKMARKELEMENT
    let bookmarkElement = document.createElement("div");
    bookmarkElement.className = `bookmark`;
    let bmid =bookmark.time.toString().split('.');

    bookmarkElement.id = `bookmark-${bmid[0]}_${bmid[1]}`;
    //TITLE
    let bookmarkTitle = document.createElement("div");
    bookmarkTitle.className = 'bookmark-title';
    bookmarkTitle.innerHTML =
        `<div>${bookmark.desc}</div>`
    bookmarkElement.appendChild(bookmarkTitle);

    //CONTROLS
    let bookmarkControls = document.createElement("div");
    bookmarkControls.className = 'bookmark-controls';
    let tab = await getCurrentTab();

    let playListener = async () => {
        await onPlay(bookmark.time, tab.id);

    };
    let deleteListener = async () => {
        await onDelete(bookmark.time, tab.id);
    };
    setBookmarkAttributes("play", playListener, bookmarkControls);
    setBookmarkAttributes("delete", deleteListener, bookmarkControls);
    bookmarkElement.appendChild(bookmarkControls)
    bookmarksContainer.appendChild(bookmarkElement);
};

const viewBookmarks = (videoId, videoBookmarks = []) => {
    let bookmarksContainer = document.querySelector(".bookmarks");
    for (const bookmark of videoBookmarks) {
        addNewBookmark(bookmark, bookmarksContainer);
    }
};

const onPlay = async (time, id) => {
    await chrome.tabs.sendMessage(id, {
        type: "PLAY",
        time: time
    })

};

const onDelete = async (time,id) => {
    let bmid=time.toString().split('.');
    let bookmarkElement =document.querySelector(`#bookmark-${bmid[0]}_${bmid[1]}`)
    bookmarkElement.parentNode.removeChild(bookmarkElement);
    await chrome.tabs.sendMessage(id, {
        type: "DELETE",
        time: time
    },viewBookmarks)

};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
    let img = document.createElement('img');
    img.src = chrome.runtime.getURL(`assets/${src}.png`);
    img.width = img.height = 18;
    img.addEventListener("click", eventListener);
    controlParentElement.appendChild(img);
}

document.addEventListener("DOMContentLoaded", async () => {
    let tab = await getCurrentTab();
    if (tab.url && tab.url.includes("youtube.com")) {
        let tmpurl = tab.url.split('?')[1];
        let urlParams = new URLSearchParams(tmpurl);
        let videoId = urlParams.get('v');
        console.log(videoId)
        let videoBookmarks = await fetchBookmarks(videoId);
        viewBookmarks(videoId, videoBookmarks);


    } else {
        document.querySelector(".title").innerText = "This is not a youtube page.";
    }

});
