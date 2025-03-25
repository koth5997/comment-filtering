let currentUserId = null;

// 확장 프로그램 시작 시 userId 자동으로 가져오기
chrome.runtime.onStartup.addListener(() => {
  chrome.identity.getProfileUserInfo(userInfo => {
    if (userInfo && userInfo.id) {
      currentUserId = userInfo.id;
      console.log("onStartup - userId 저장됨:", currentUserId);
    }
  });
});

// 확장 프로그램 설치 시에도 userId 저장
chrome.runtime.onInstalled.addListener(() => {
  chrome.identity.getProfileUserInfo(userInfo => {
    if (userInfo && userInfo.id) {
      currentUserId = userInfo.id;
      console.log("onInstalled - userId 저장됨:", currentUserId);
    }
  });
});

// popup.js → background로 userId 저장
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SET_USER_ID") {
    currentUserId = message.userId;
    console.log("popup.js로부터 userId 저장:", currentUserId);
  }

  if (message.type === "GET_USER_ID") {
    console.log("📨 content.js에서 요청 → userId 응답:", currentUserId);
    sendResponse({ userId: currentUserId });
  }

  return true;
});
