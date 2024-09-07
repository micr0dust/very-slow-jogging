// 準備木魚聲音的音頻文件
const woodblockSound = new Audio('./woodblock.mp3');
var volume = 1.0;

function changeVolume() {
    volume -= 0.1;
    if (volume < 0.05) {
        volume = 1.0;
    }
    playClick(volume);
    const countdownOverlay = document.getElementById('countdown-overlay');
    const countdownNumber = document.getElementById('countdown-number');
    countdownNumber.textContent = `${parseInt(volume*100)}%`;
    countdownOverlay.style.display = 'flex';
    setTimeout(() => {
        countdownOverlay.style.display = 'none';
    }, 500);
}

// 節拍器聲音函數
function playClick(volume = 1.0) {
    woodblockSound.currentTime = 0; // 重置音頻播放時間
    woodblockSound.volume = volume; // 設置音量
    woodblockSound.play(); // 播放音頻
}

// 控制 BPM
function startMetronome(bpm) {
    const interval = 60000 / bpm; // 計算間隔時間
    const intervalId = setInterval(() => playClick(volume), interval); // 設定間隔並儲存 interval ID
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

async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => {
            console.log('Screen Wake Lock released:', wakeLock.released);
        });
        console.log('Screen Wake Lock acquired:', wakeLock);
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
}

function startCountdownWithSound() {
    const countdownOverlay = document.getElementById('countdown-overlay');
    const countdownNumber = document.getElementById('countdown-number');
    let countdown = 3;

    countdownOverlay.style.display = 'flex';
    countdownNumber.textContent = countdown;
    playSound(440);

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownNumber.textContent = countdown;
            playSound(440); // 替換為實際的倒數音效 URL
        } else {
            clearInterval(countdownInterval);
            countdownOverlay.style.display = 'none';
            playSound(880); // 替換為實際的開始音效 URL
            startMainFunction();
        }
    }, 1000);
}

// 使用 Web Audio API 產生音效
function playSound(frequency) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); // 設定頻率
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5); // 播放 0.5 秒
}

function startMainFunction() {
    let bpm = document.getElementById('bpm').value;
    let time = document.getElementById('time').value;
    startCountdown(time);
    const metronomeId = startMetronome(bpm);
    setTimeout(() => {
        clearInterval(metronomeId);
        window.scrollTo(0, 0);
        document.getElementById('main').style.display = 'none';
        document.getElementById('end').style.display = 'block';
        setInterval(createBalloon, 200);
        new Audio("./achieve.mp3").play();
    }, time * 60 * 1000);
}