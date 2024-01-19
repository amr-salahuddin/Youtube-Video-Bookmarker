(() => {

    let youtubeRightControls, youtubePlayer;
    let currentVideo;
    let currentVideoBookmarks = [];
    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
            const {type, videoId, time} = request;
            if (type === "NEW") {
                currentVideo = videoId;
                newVideoLoaded();
            } else if (type === "PLAY") {
                youtubePlayer.currentTime = time;
            } else if (type === "DELETE") {
                currentVideoBookmarks.filter(a =>
                    a.time != time
                );
                chrome.storage.sync.set({[currentVideo]: JSON.stringify(currentVideoBookmarks)});
                sendResponse(currentVideo,currentVideoBookmarks);
            }
        }
    )

    async function fetchBookmarks(videoId) {
        const tmpBookmarks = await chrome.storage.sync.get([videoId]);
        let videoBookmarks = tmpBookmarks[videoId] ? tmpBookmarks[videoId] : '[]';
        videoBookmarks = JSON.parse(videoBookmarks);
        console.log(videoBookmarks)
        return videoBookmarks;
    }

    const newVideoLoaded = () => {
        const bookmarkBtnExists = document.querySelector(".bookmark-btn");
        if (!bookmarkBtnExists) {
            //get rightControls
            youtubeRightControls = document.querySelector(".ytp-right-controls");

            //get videoPlayer
            youtubePlayer = document.querySelector(".video-stream");
            console.log(youtubeRightControls)
            //bookmarkBtn
            const bookmarkBtn = document.createElement("img");
            bookmarkBtn.className = "bookmark-btn";
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.alt = "bookmark";
            bookmarkBtn.title = "Click to bookmark current timestamp";
            bookmarkBtn.width = "48";
            bookmarkBtn.height = "48";
            bookmarkBtn.addEventListener("click", addNewBookmark);
            youtubeRightControls.appendChild(bookmarkBtn);
        }

    }

    const addNewBookmark = async () => {
        const currentTime = youtubePlayer.currentTime;
        let timeString = getBookmarkTime(currentTime);
        currentVideoBookmarks = await fetchBookmarks(currentVideo);
        for (let i = 0; i < currentVideoBookmarks.length; i++) {
            if (currentVideoBookmarks[i].time === currentTime) {
                return;
            }
        }
        const newBookmark = {
            time: currentTime,
            desc: `Bookmark at ${timeString}`
        }
        await chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        })
    }
})();

const getBookmarkTime = (time = 0) => {
    let date = new Date(0);

    date.setMilliseconds(time * 1000);
    return date.toISOString().substring(11, 11 + 11);
}