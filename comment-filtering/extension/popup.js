document.addEventListener("DOMContentLoaded", function () {
    const badWordInput = document.getElementById("bad-word");
    const addWordButton = document.getElementById("add-word");
    const wordList = document.getElementById("word-list");
    
    let userId = null;
    
    // OAuth 로그인 + 사용자 정보 가져오기
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
        if (chrome.runtime.lastError || !token) {
            console.error("로그인 실패:", chrome.runtime.lastError?.message);
            alert("로그인에 실패했습니다.");
            // 로그인 실패 시 기본 사용자 ID 생성
            userId = "default_user_" + Date.now();
            console.log("⚠️ 기본 userId 생성:", userId);
            chrome.runtime.sendMessage({
                type: "SET_USER_ID",
                userId: userId
            });
            loadUserBadWords(userId);
            return;
        }
        
        console.log("✅ 로그인 성공, 토큰:", token);
        
        // Google API를 직접 호출하여 사용자 정보 가져오기
        fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: { Authorization: 'Bearer ' + token }
        })
        .then(response => response.json())
        .then(data => {
            userId = data.id || data.email.split('@')[0];
            console.log("✅ Google API에서 userId 가져옴:", userId);
            
            chrome.runtime.sendMessage({
                type: "SET_USER_ID",
                userId: userId
            });
            
            loadUserBadWords(userId);
        })
        .catch(error => {
            console.error("Google API 오류:", error);
            // API 호출 실패 시 기본 ID 생성
            userId = "default_user_" + Date.now();
            console.log("⚠️ 기본 userId 생성:", userId);
            chrome.runtime.sendMessage({
                type: "SET_USER_ID",
                userId: userId
            });
            loadUserBadWords(userId);
        });
    });
    
    // 금칙어 추가 버튼 클릭
    addWordButton.addEventListener("click", function () {
        const badWord = badWordInput.value.trim();
        if (!badWord) return alert("금칙어를 입력하세요.");
        if (!userId) return alert("사용자 정보를 불러오지 못했습니다.");
        
        fetch("http://127.0.0.1:8000/user_badwords", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, word: badWord })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            badWordInput.value = ""; // 입력 필드 초기화
            loadUserBadWords(userId);
        })
        .catch(err => {
            console.error("API 오류:", err);
            alert("금칙어 추가 중 오류가 발생했습니다.");
        });
    });
    
    function loadUserBadWords(userId) {
        fetch(`http://127.0.0.1:8000/user_badwords/${userId}`)
            .then(res => res.json())
            .then(data => {
                wordList.innerHTML = "";
                if (data.bad_words && data.bad_words.length > 0) {
                    data.bad_words.forEach(word => {
                        const li = document.createElement("li");
                        li.textContent = word;
                        const btn = document.createElement("button");
                        btn.textContent = "삭제";
                        btn.onclick = () => deleteUserBadWord(userId, word);
                        li.appendChild(btn);
                        wordList.appendChild(li);
                    });
                } else {
                    const emptyMsg = document.createElement("p");
                    emptyMsg.textContent = "등록된 금칙어가 없습니다.";
                    wordList.appendChild(emptyMsg);
                }
            })
            .catch(err => {
                console.error("금칙어 목록 불러오기 오류:", err);
                wordList.innerHTML = "<p>금칙어 목록을 불러오는 중 오류가 발생했습니다.</p>";
            });
    }
    
    function deleteUserBadWord(userId, word) {
        fetch(`http://127.0.0.1:8000/user_badwords/${userId}/${word}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            loadUserBadWords(userId);
        })
        .catch(err => {
            console.error("금칙어 삭제 오류:", err);
            alert("금칙어 삭제 중 오류가 발생했습니다.");
        });
    }
});