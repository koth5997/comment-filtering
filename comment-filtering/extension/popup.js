document.addEventListener("DOMContentLoaded", function () {
  const badWordInput   = document.getElementById("bad-word");
  const addWordButton  = document.getElementById("add-word");
  const categorySelect = document.getElementById("category");
  const wordList       = document.getElementById("word-list");
  const summaryDiv     = document.getElementById("category-summary");
  let userId           = null;

  // 1) OAuth 로그인 & userId 설정
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    if (chrome.runtime.lastError || !token) {
      console.error("로그인 실패:", chrome.runtime.lastError?.message);
      alert("로그인에 실패했습니다. 임시 ID 사용");
      userId = "default_user_" + Date.now();
      chrome.runtime.sendMessage({ type: "SET_USER_ID", userId });
      loadUserBadWords(userId);
      return;
    }

    fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.ok ? res.json() : res.text().then(t => { throw new Error(t); }))
      .then(data => {
        userId = data.id || data.email.split("@")[0];
        chrome.runtime.sendMessage({ type: "SET_USER_ID", userId });
        loadUserBadWords(userId);
      })
      .catch(err => {
        console.error("Google API 오류:", err);
        userId = "default_user_" + Date.now();
        chrome.runtime.sendMessage({ type: "SET_USER_ID", userId });
        loadUserBadWords(userId);
      });
  });

  // 2) 금칙어 추가
  addWordButton.addEventListener("click", function () {
    const word     = badWordInput.value.trim();
    const category = categorySelect.value;
    if (!word)      return alert("금칙어를 입력하세요.");
    if (!userId)    return alert("사용자 정보를 불러오지 못했습니다.");

    fetch("http://127.0.0.1:8000/user_badwords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, word, category })
    })
      .then(res => res.ok ? res.json() : res.text().then(t => { throw new Error(t); }))
      .then(data => {
        alert(data.message);
        badWordInput.value = "";
        loadUserBadWords(userId);
      })
      .catch(err => {
        console.error("금칙어 추가 중 오류:", err);
        alert("추가 실패: " + err.message);
      });
  });

  // 3) 금칙어 목록 & 카테고리 요약 로드
  function loadUserBadWords(userId) {
    fetch(`http://127.0.0.1:8000/user_badwords/${userId}`)
      .then(res => res.ok ? res.json() : res.text().then(t => { throw new Error(t); }))
      .then(data => {
        const arr = data.bad_words || [];

        // — 카테고리별 요약
        const map = {};
        arr.forEach(({ word, category }) => {
          (map[category] = map[category] || []).push(word);
        });
        summaryDiv.innerHTML = Object.entries(map).length
          ? Object.entries(map)
              .map(([cat, words]) => `<strong>${cat}</strong>: ${words.join(", ")}`)
              .join("<br>")
          : "등록된 금칙어가 없습니다.";

        // — 리스트 렌더링
        wordList.innerHTML = "";
        if (arr.length === 0) {
          wordList.innerHTML = "<li>등록된 금칙어가 없습니다.</li>";
        } else {
          arr.forEach(({ word, category }) => {
            const li = document.createElement("li");
            // 단어 + 카테고리 뱃지
            li.innerHTML = `
              ${word}
              <span class="badge">${category}</span>
            `;
            const btn = document.createElement("button");
            btn.textContent = "삭제";
            btn.onclick   = () => deleteUserBadWord(userId, word);
            li.appendChild(btn);
            wordList.appendChild(li);
          });
        }
      })
      .catch(err => {
        console.error("목록 로드 오류:", err);
        summaryDiv.textContent = "";
        wordList.innerHTML = `<li>로딩 중 오류: ${err.message}</li>`;
      });
  }

  // 4) 금칙어 삭제
  function deleteUserBadWord(userId, word) {
    fetch(`http://127.0.0.1:8000/user_badwords/${userId}/${encodeURIComponent(word)}`, {
      method: "DELETE"
    })
      .then(res => res.ok ? res.json() : res.text().then(t => { throw new Error(t); }))
      .then(data => {
        alert(data.message);
        loadUserBadWords(userId);
      })
      .catch(err => {
        console.error("삭제 중 오류:", err);
        alert("삭제 실패: " + err.message);
      });
  }
});
