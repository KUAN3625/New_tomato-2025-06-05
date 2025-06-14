
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
let isDragging = false;
let startX = 0;
let pendingTimeout = null;
let isInPendingState = false;

const dragWrapper = document.querySelector('.drag-wrapper');

dragWrapper.addEventListener('mousedown', (e) => {
    if (isInPendingState) return;
    isDragging = true;
    startX = e.clientX;
    document.body.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    dragWrapper.style.transform = `translateX(${dx}px)`;

// 計算預覽時間
    const deltaMinutes = Math.round(dx / 5);
    const currentMinutes = Math.floor(timeLeft / 60);
    const previewMinutes = Math.max(1, Math.min(60, currentMinutes + deltaMinutes));

    // 顯示預覽時間
    const preview = document.getElementById("time-preview");
    preview.textContent = `${previewMinutes} 分鐘`;
    preview.style.display = 'block';
});

document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.cursor = 'default';

    const dx = e.clientX - startX;
    const deltaMinutes = Math.round(dx / 5);
    const currentMinutes = Math.floor(timeLeft / 60);
    const newMinutes = Math.max(1, Math.min(60, currentMinutes + deltaMinutes));

    dragWrapper.style.transform = `translateX(0)`;
    timeLeft = newMinutes * 60;
    totalTime = timeLeft;
    timerDisplay.textContent = formatTime(timeLeft);

    const msg = document.createElement('div');
    msg.textContent = `⏳ ${newMinutes} 分鐘後即將開始，點擊圓圈可取消`;
    msg.classList.add('pending-msg');
    msg.style.position = 'absolute';
    msg.style.top = '60%';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.color = 'white';
    msg.style.fontSize = '1rem';
    msg.style.zIndex = 99;
    document.body.appendChild(msg);

    isInPendingState = true;

    pendingTimeout = setTimeout(() => {
        document.body.removeChild(msg);
        isInPendingState = false;
        dragWrapper.click();
    }, 3000);
});

dragWrapper.addEventListener('click', () => {
    if (!isInPendingState) return;
    clearTimeout(pendingTimeout);
    const msg = document.querySelector('.pending-msg');
    if (msg) document.body.removeChild(msg);
    isInPendingState = false;
});
