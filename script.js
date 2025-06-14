
//選擇畫面時間區塊
const timerDisplay = document.getElementById("timer");

//暫停鍵
const resetButton = document.getElementById("reset");

let totalTime = 300; // 初始時間
let timeLeft = 300;
let countdownInterval = null;

// 分分:秒秒格式
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

timerDisplay.textContent = formatTime(timeLeft);

// 📌 點擊圓環開始 / 暫停倒數
document.querySelector(".timer-ring").addEventListener("click", () => {
    const rabbit = document.querySelector(".rabbit-sprite");

    if (countdownInterval !== null) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        rabbit.classList.remove("rabbit-run");
        return;
    }

    rabbit.classList.add("rabbit-run");

    countdownInterval = setInterval(() => {
        timeLeft--;
        document.querySelector(".rabbit-sprite").classList.add("rabbit-run");
        const progressAngle = (timeLeft / totalTime) * 360;
        timerDisplay.textContent = formatTime(timeLeft);
        document.querySelector(".timer-ring").style.background =
            `conic-gradient(rgb(255, 77, 77) ${progressAngle}deg, #fff 0deg)`;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            timerDisplay.textContent = "00:00";
            alert("你做到了！");
        }
    }, 1000);
});

// 📌 點擊重置
resetButton.addEventListener("click", () => {
    document.querySelector(".rabbit-sprite").classList.remove("rabbit-run");
    clearInterval(countdownInterval);
    countdownInterval = null;
    timeLeft = 300;
    totalTime = 300;
    timerDisplay.textContent = formatTime(timeLeft);
    document.querySelector(".timer-ring").style.background =
        `conic-gradient(#fff 360deg, rgb(255, 77, 77) 0deg)`;
});

// 📌 切換快速設定時間（左右小球）
document.querySelectorAll('.switch-ball').forEach(ball => {
    ball.addEventListener('click', () => {
        clearInterval(countdownInterval);
        countdownInterval = null;
        const newMinutes = parseInt(ball.dataset.minutes);
        timeLeft = newMinutes * 60;
        totalTime = timeLeft;
        document.querySelector(".rabbit-sprite").classList.remove("rabbit-run");
        timerDisplay.textContent = formatTime(timeLeft);
        document.querySelector(".timer-ring").style.background =
            `conic-gradient(#fff 360deg, rgb(255, 77, 77) 0deg)`;
    });
});

// === 拖曳調整時間，拖動結束後自動倒數，允許取消 ===
// === 拖曳調整時間，拖動結束後自動倒數，允許取消 ===
const dragWrapper = document.querySelector('.drag-wrapper');

dragWrapper.addEventListener('mousedown', handleStart);
dragWrapper.addEventListener('touchstart', handleStart);

document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove, { passive: false });

document.addEventListener('mouseup', handleEnd);
document.addEventListener('touchend', handleEnd);



let isDragging = false;
let startX = 0;
let longPressTimeout = null;
let preview = document.getElementById("time-preview");

function getClientX(event) {
    return event.touches ? event.touches[0].clientX : event.clientX;
}

function handleStart(e) {
    if (countdownInterval !== null) return;
    longPressTimeout = setTimeout(() => {
        isDragging = true;
        startX = getClientX(e);
        document.body.style.cursor = 'grabbing';
        preview.style.opacity = '1';
    }, 500);
}

function handleMove(e) {
    if (!isDragging) return;
    const dx = getClientX(e) - startX;
    dragWrapper.style.transform = `translateX(${dx}px)`;

    const deltaMinutes = Math.round(dx / 5);
    const currentMinutes = Math.floor(timeLeft / 60);
    const previewMinutes = Math.max(1, Math.min(60, currentMinutes + deltaMinutes));
    preview.textContent = `${previewMinutes}`;
}

function handleEnd(e) {
    clearTimeout(longPressTimeout);
    if (!isDragging) return;

    isDragging = false;
    document.body.style.cursor = 'default';
    dragWrapper.style.transform = `translateX(0)`;
    preview.style.opacity = '0';

    const dx = getClientX(e) - startX;
    const deltaMinutes = Math.round(dx / 5);
    const currentMinutes = Math.floor(timeLeft / 60);
    const newMinutes = Math.max(1, Math.min(60, currentMinutes + deltaMinutes));

    timeLeft = newMinutes * 60;
    totalTime = timeLeft;
    timerDisplay.textContent = formatTime(timeLeft);

    // ✅ 直接啟動倒數
    document.querySelector(".rabbit-sprite").classList.add("rabbit-run");
    countdownInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);
        const progressAngle = (timeLeft / totalTime) * 360;
        document.querySelector(".timer-ring").style.background =
            `conic-gradient(rgb(255, 77, 77) ${progressAngle}deg, #fff 0deg)`;
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            timerDisplay.textContent = "00:00";
            alert("你做到了！");
        }
    }, 1000);
}
