console.log("프로그램 시작작");

// 댓글 로딩 확인 후 관찰 시작
const waitForComments = (callback, maxRetries = 15) => {
    let retries = 0;
    const interval = setInterval(() => {
        let targetNode;

        if (window.location.hostname.includes("youtube.com")) {
            targetNode = document.querySelector("#comments");
        } else if (window.location.hostname.includes("n.news.naver.com")) {
            targetNode = document.querySelector(".u_cbox_content_wrap");
        }

        if (targetNode) {
            clearInterval(interval);
            callback(targetNode);
        } else {
            console.log(`찾는중중 (${retries + 1}/${maxRetries})`);
            retries++;
            if (retries >= maxRetries) {
                clearInterval(interval);
                console.log("댓글 영역을 찾을 수 없음.");
            }
        }
    }, 1000);
};

// 댓글 추출 함수
const extractComments = () => {
    let comments = [];

    if (window.location.hostname.includes("youtube.com")) {
        document.querySelectorAll("#content-text").forEach(comment => {
            comments.push(comment.innerText);
        });
    } else if (window.location.hostname.includes("n.news.naver.com")) {
        
        document.querySelectorAll("span.u_cbox_contents").forEach(comment => {
            comments.push(comment.innerText);
        });
    }

    if (comments.length > 0) {
        console.log("크롤링한 댓글:", comments);
        sendToBackend(comments);
    }
};

// 댓글 영역을 계속 관찰
const observeComments = (targetNode) => {
    console.log("댓글 감지 시작!");
    const observer = new MutationObserver(() => {
        extractComments();
    });

    observer.observe(targetNode, { childList: true, subtree: true });
};

// 댓글을 FastAPI 백엔드로 전송
const sendToBackend = (comments) => {
    fetch("http://127.0.0.1:8000/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: comments })
    })
    .then(response => response.json())
    .then(data => {
        console.log("🔍 필터링 결과:", data);
        applyBlur(data.filtered_comments);
    })
    .catch(error => console.error("API 요청 오류:", error));
};

// 필터링된 댓글을 블러 처리
const applyBlur = (filteredComments) => {
    if (window.location.hostname.includes("youtube.com")) {
        document.querySelectorAll("#content-text").forEach(comment => {
            if (filteredComments.includes(comment.innerText)) {
                comment.style.filter = "blur(5px)";
            }
        });
    } else if (window.location.hostname.includes("n.news.naver.com")) {
        document.querySelectorAll("span.u_cbox_contents").forEach(comment => {
            if (filteredComments.includes(comment.innerText)) {
                comment.style.filter = "blur(5px)";
            }
        });
    }
};

waitForComments(observeComments);
