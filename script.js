// 세계시각
const countrySelector = document.getElementById("country-selector");
const worldTime = document.getElementById("world-time");
let worldClockInterval;

countrySelector.addEventListener("change", () => {
    clearInterval(worldClockInterval); // 기존 타이머 제거
    const timezone = countrySelector.value;
    if (timezone === "UTC") {
        worldTime.textContent = "00:00:00";
        return;
    }
    worldClockInterval = setInterval(() => {
        const now = new Date();
        const options = { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        worldTime.textContent = now.toLocaleTimeString('en-US', options);
    }, 1000);
});

// 스톱워치
let stopwatchInterval, stopwatchTime = 0, isPaused = true;
const stopwatchDisplay = document.getElementById("stopwatch-time");

document.getElementById("start-stopwatch").addEventListener("click", () => {
    if (isPaused) {
        isPaused = false;
        stopwatchInterval = setInterval(() => {
            stopwatchTime += 10; // 10ms 단위
            const hours = Math.floor(stopwatchTime / 3600000).toString().padStart(2, '0');
            const minutes = Math.floor((stopwatchTime % 3600000) / 60000).toString().padStart(2, '0');
            const seconds = Math.floor((stopwatchTime % 60000) / 1000).toString().padStart(2, '0');
            const milliseconds = (stopwatchTime % 1000).toString().padStart(3, '0');
            stopwatchDisplay.textContent = `${hours}:${minutes}:${seconds}.${milliseconds}`;
        }, 10);
    }
});

document.getElementById("stop-stopwatch").addEventListener("click", () => {
    if (!isPaused) {
        clearInterval(stopwatchInterval);
        isPaused = true;
    }
});

document.getElementById("reset-stopwatch").addEventListener("click", () => {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    isPaused = true;
    stopwatchDisplay.textContent = "00:00:00.000";
});

// 타이머
let timerInterval;
let timerPausedTime = null;
document.getElementById("start-timer").addEventListener("click", () => {
    if (timerPausedTime) {
        // 타이머가 일시정지 상태일 때
        timerInterval = setInterval(() => {
            timerPausedTime -= 1000;
            updateTimerDisplay(timerPausedTime);
            if (timerPausedTime <= 0) clearInterval(timerInterval);
        }, 1000);
    } else {
        const hours = parseInt(document.getElementById("hours-input").value) || 0;
        const minutes = parseInt(document.getElementById("minutes-input").value) || 0;
        const seconds = parseInt(document.getElementById("seconds-input").value) || 0;
        let timerTime = (hours * 3600 + minutes * 60 + seconds) * 1000; // 시간, 분, 초 -> 밀리초
        timerInterval = setInterval(() => {
            timerTime -= 1000;
            updateTimerDisplay(timerTime);
            if (timerTime <= 0) {
                clearInterval(timerInterval);
                timerTimeout();
            }
        }, 1000);
    }
});

document.getElementById("stop-timer").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerPausedTime = timerPausedTime || 0; // 일시 정지 시 남은 시간 저장
});

document.getElementById("reset-timer").addEventListener("click", () => {
    clearInterval(timerInterval);
    document.getElementById("timer-display").textContent = "00:00:00";
    timerPausedTime = null;
});

function updateTimerDisplay(time) {
    const hours = Math.floor(time / 3600000).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
    document.getElementById("timer-display").textContent = `${hours}:${minutes}:${seconds}`;
}

function timerTimeout() {
    alert("Timer Finished!");
}

// 알람
let alarmTimeout, alarmSound;
document.getElementById("set-alarm").addEventListener("click", () => {
    clearTimeout(alarmTimeout);
    const alarmCountry = document.getElementById("alarm-country-selector").value;
    const alarmTime = document.getElementById("alarm-time").value;

    if (!alarmTime || alarmCountry === "UTC") {
        document.getElementById("alarm-status").textContent = "Invalid time or country.";
        return;
    }

    // 알람 시간을 설정한 국가의 시간대에 맞춰 계산
    const now = new Date();
    const [hours, minutes] = alarmTime.split(":").map(Number);
    
    // 해당 국가의 시간대 정보를 사용하여, 알람 시간을 맞춤
    const timeZone = alarmCountry;
    const alarmDate = new Date(now.toLocaleString('en-US', { timeZone }));

    alarmDate.setHours(hours);
    alarmDate.setMinutes(minutes);
    alarmDate.setSeconds(0);

    // 알람이 현재 시간보다 과거일 경우 내일로 설정
    let timeToAlarm = alarmDate - now;
    if (timeToAlarm <= 0) {
        alarmDate.setDate(alarmDate.getDate() + 1); // 내일로 설정
        timeToAlarm = alarmDate - now;
    }

    document.getElementById("alarm-status").textContent = "Alarm set!";
    alarmTimeout = setTimeout(() => {
        alarmSound = new Audio('https://www.soundjay.com/button/beep-07.wav'); // 비프음
        alarmSound.loop = true; // 무한 반복
        alarmSound.play();
        alert("Alarm ringing!");
        document.getElementById("alarm-status").textContent = "No alarm set";

        // 알람 중지 버튼
        const stopAlarm = () => {
            alarmSound.pause();
            alarmSound.currentTime = 0;
        };

        // 알람 팝업
        const alarmPopup = window.alert("Alarm is ringing! Click OK to stop the sound.");
        if (alarmPopup === true) {
            stopAlarm();
        }

    }, timeToAlarm);
});