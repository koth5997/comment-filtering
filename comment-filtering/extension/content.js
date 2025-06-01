console.log("프로그램 시작");

chrome.runtime.sendMessage({ type: "GET_USER_ID" }, (response) => {
    const userId = response?.userId;
    if (!userId) {
        console.error("userId 가져오기 실패");
        return;
    }

    console.log("받은 userId:", userId);

    waitForComments((targetNode) => {
        observeComments(targetNode, userId);
        applyUserDefinedWords(userId); // 🔸 초기에도 사용자 금칙어 블러 처리
    });
});

const waitForComments = (callback, maxRetries = 15) => {
    let retries = 0;
    const interval = setInterval(() => {
        let targetNode;

        if (window.location.hostname.includes("youtube.com")) {
            targetNode = document.querySelector("#comments");
        } else if (window.location.hostname.includes("n.news.naver.com")) {
            targetNode = document.querySelector(".u_cbox_content_wrap") || document.querySelector("#comment"); // 예외 보완
        }

        if (targetNode) {
            clearInterval(interval);
            console.log("댓글 영역 발견:", targetNode);
            callback(targetNode);
        } else {
            retries++;
            console.log(`댓글 영역 찾는 중... (${retries}/${maxRetries})`);
            if (retries >= maxRetries) {
                clearInterval(interval);
                console.log("댓글 영역을 찾지 못함");
            }
        }
    }, 1000);
};

const extractComments = () => {
    const comments = [];

    if (window.location.hostname.includes("youtube.com")) {
        document.querySelectorAll("#content-text").forEach(el => {
            comments.push({ text: el.innerText.trim(), element: el });
        });
    } else if (window.location.hostname.includes("n.news.naver.com")) {
        document.querySelectorAll("span.u_cbox_contents").forEach(el => {
            comments.push({ text: el.innerText.trim(), element: el });
        });
    }

    console.log(`추출된 댓글 ${comments.length}개`);
    return comments;
};

const sendToBackend = (comments, userId) => {
    const commentTexts = comments.map(c => c.text);

    console.log(`백엔드 API 요청: ${commentTexts.length}개 댓글, 사용자 ID: ${userId}`);

    fetch("http://127.0.0.1:8000/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            comments: commentTexts,
            user_id: userId
        })
    })
        .then(res => {
            if (!res.ok) throw new Error(`API 요청 실패: ${res.status}`);
            return res.json();
        })
        .then(data => {
            console.log("필터링 결과:", data);
            if (data.filtered_comments?.length > 0) {
                console.log(`필터링된 댓글: ${data.filtered_comments.length}개`);
                applyBlur(comments, data.filtered_comments);
            } else {
                console.log("필터링된 댓글 없음");
            }
        })
        .catch(err => console.error("API 오류:", err));
};

const applyBlur = (comments, filteredTexts) => {
    console.log("블러 처리 시작");

    comments.forEach(comment => {
        if (filteredTexts.some(filtered => comment.text.includes(filtered))) {
            console.log(`블러 처리: "${comment.text.substring(0, 20)}..."`);
            comment.element.style.filter = "blur(5px)";
            const parent = comment.element.parentElement;
            if (parent) {
                parent.style.border = "2px solid red";
                parent.title = "금칙어가 포함된 댓글입니다";
            }
        }
    });
};

const observeComments = (targetNode, userId) => {
    console.log(`댓글 영역 관찰 시작 (userId: ${userId})`);

    const observer = new MutationObserver(() => {
        console.log("댓글 영역 변경 감지");
        const comments = extractComments();
        if (comments.length > 0) {
            sendToBackend(comments, userId);
            applyUserDefinedWords(userId);
        }
    });

    observer.observe(targetNode, { childList: true, subtree: true });
    console.log("MutationObserver 등록 완료");

    const initial = extractComments();
    if (initial.length > 0) {
        console.log(`초기 댓글 ${initial.length}개 필터링 시작`);
        sendToBackend(initial, userId);
        applyUserDefinedWords(userId);
    } else {
        console.log("초기 댓글이 없습니다");
    }
};

function applyUserDefinedWords(userId) {
    fetch(`http://127.0.0.1:8000/user_badwords/${userId}`)
        .then(res => res.json())
        .then(data => {
            const badWords = data.bad_words || [];
            if (badWords.length === 0) return;

            console.log("사용자 금칙어 목록:", badWords);

            const blurComments = (selector) => {
                document.querySelectorAll(selector).forEach(comment => {
                    const text = comment.innerText.trim();
                    if (badWords.some(word => text.includes(word))) {
                        comment.style.filter = "blur(5px)";
                        comment.title = "사용자 금칙어에 의해 블러 처리됨";
                    }
                });
            };

            if (window.location.hostname.includes("youtube.com")) {
                blurComments("#content-text");
            } else if (window.location.hostname.includes("n.news.naver.com")) {
                blurComments("span.u_cbox_contents");
            }
        })
        .catch(err => console.error("사용자 금칙어 로딩 실패:", err));
}
