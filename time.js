function updateLocalClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let milliseconds = now.getMilliseconds();

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    milliseconds = ("00" + milliseconds).slice(-3);

    const timeString = hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    document.getElementById('clock').innerText = timeString;

    const epochTime = Math.floor(now.getTime() / 1000);
    document.getElementById('epoch-seconds').innerText = epochTime;

    // Binary 32-bit
    const binary32 = (epochTime >>> 0).toString(2).padStart(32, '0');
    document.getElementById('binary32').innerText = binary32;

    // Binary 64-bit
    const binary64 = BigInt(epochTime).toString(2).padStart(64, '0');
    document.getElementById('binary64').innerText = binary64;

    // Hexadecimal
    const hexadecimal = epochTime.toString(16).toUpperCase().padStart(8, '0');
    document.getElementById('hexadecimal').innerText = hexadecimal;

    // Countdown to 2038-01-19 03:14:07 UTC
    const endDate = new Date('2038-01-19T03:14:07Z').getTime();
    const timeLeft = endDate - now.getTime();

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

    const countdownString = days + "日 " + hoursLeft + "時間 " + minutesLeft + "分 " + secondsLeft + "秒";
    document.getElementById('countdown').innerText = countdownString;
}

function updatePCClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let milliseconds = now.getMilliseconds();

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    milliseconds = ("00" + milliseconds).slice(-3);

    const timeString = hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    document.getElementById('pc-clock').innerText = timeString;
}

function fetchServerTime() {
    fetch('http://worldtimeapi.org/api/timezone/Etc/UTC')
        .then(response => response.json())
        .then(data => {
            const serverTime = new Date(data.utc_datetime);
            let hours = serverTime.getHours();
            let minutes = serverTime.getMinutes();
            let seconds = serverTime.getSeconds();
            let milliseconds = serverTime.getMilliseconds();

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
            milliseconds = ("00" + milliseconds).slice(-3);

            const timeString = hours + ":" + minutes + ":" + seconds + "." + milliseconds;
            document.getElementById('server-clock').innerText = timeString;
        })
        .catch(error => console.error('Error fetching server time:', error));
}

setInterval(updateLocalClock, 1);
updateLocalClock();

setInterval(updatePCClock, 1);
updatePCClock();

setInterval(fetchServerTime, 1000);
fetchServerTime();
