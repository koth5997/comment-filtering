let currentUserId = null;

// 메시지 핸들러: popup.js에서 전달된 userId 저장, content.js 요청 시 응답
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SET_USER_ID") {
        currentUserId = message.userId;
        console.log("popup.js로부터 userId 저장:", currentUserId);
    } else if (message.type === "GET_USER_ID") {
        console.log("content.js에서 요청 → userId 응답:", currentUserId);
        sendResponse({ userId: currentUserId });
    }
    return true; // 비동기 sendResponse 허용
});

// 확장 프로그램 시작 또는 설치 시 Chrome 로그인 userId 초기 저장 (선택사항)
function fetchProfileUserId() {
    chrome.identity.getProfileUserInfo(userInfo => {
        if (userInfo && userInfo.id) {
            currentUserId = userInfo.id;
            console.log("Chrome 로그인 userId 저장:", currentUserId);
        }
    });
}

chrome.runtime.onStartup.addListener(fetchProfileUserId);
chrome.runtime.onInstalled.addListener(fetchProfileUserId);
