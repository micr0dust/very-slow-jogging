// 準備木魚聲音的音頻文件
const woodblockSound = new Audio('./woodblock.mp3');

// 節拍器聲音函數
function playClick() {
    woodblockSound.currentTime = 0; // 重置音頻播放時間
    woodblockSound.play(); // 播放音頻
}

// 控制 BPM
function startMetronome(bpm) {
    const interval = 60000 / bpm; // 計算間隔時間
    const intervalId = setInterval(playClick, interval); // 設定間隔並儲存 interval ID
    adjustAnimationSpeed(bpm); // 調整動畫速度
    return intervalId; // 返回 interval ID
}

function adjustAnimationSpeed(bpm) {
    const runner = document.getElementById('runner');
    const speed = 60 / bpm * 2; // 計算動畫速度
    runner.style.animationDuration = `${speed}s`;
}

function formattedTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startCountdown(minutes) {
    let totalTime = minutes * 60; // 將分鐘轉換為秒

    const timerElement = document.getElementById('timer');
    timerElement.textContent = formattedTime(totalTime);
    const interval = setInterval(() => {
        // 格式化時間為MM:SS
        timerElement.textContent = formattedTime(totalTime-1);

        if (totalTime <= 0) {
            clearInterval(interval);
        } else {
            totalTime--;
        }
    }, 1000);
}

function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = Math.random() * 100 + 'vw';
    balloon.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    document.body.appendChild(balloon);
    balloon.style.zIndex = -1;
    setTimeout(() => {
        balloon.remove();
    }, 5000);
}

function ending(){
    setInterval(createBalloon, 200);
}