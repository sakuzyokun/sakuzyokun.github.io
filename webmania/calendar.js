const calendar = document.getElementById('calendar');
const currentDateElem = document.getElementById('current-date');
const yearSelect = document.getElementById('year');
let currentDate = new Date();

const monthImages = [
    'url(1月の背景画像URL)',
    'url(2月の背景画像URL)',
    'url(3月の背景画像URL)',
    'url(4月の背景画像URL)',
    'url(5月の背景画像URL)',
    'url(6月の背景画像URL)',
    'url(7月の背景画像URL)',
    'url(8月の背景画像URL)',
    'url(9月の背景画像URL)',
    'url(10月の背景画像URL)',
    'url(11月の背景画像URL)',
    'url(12月の背景画像URL)'
];

const events = {
    '12-24': 'クリスマスイブ',
    '12-25': 'クリスマス'
};

// 年の選択肢を生成
for (let i = 2000; i <= 2030; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
}

function updateBackground() {
    document.body.style.backgroundImage = monthImages[currentDate.getMonth()];
}

function updateCurrentDate() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    currentDateElem.textContent = `${year}年${month}月`;
}

function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 背景画像を更新
    updateBackground();
    // 現在の年月を更新
    updateCurrentDate();

    // カレンダーをクリア
    calendar.innerHTML = '';

    // ヘッダーを追加
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const div = document.createElement('div');
        div.textContent = day;
        div.classList.add('day', 'header');
        calendar.appendChild(div);
    });

    // 最初の日の曜日を取得
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 空白を追加
    for (let i = 0; i < firstDay; i++) {
        const div = document.createElement('div');
        div.classList.add('day');
        calendar.appendChild(div);
    }

    // 日付を追加
    for (let i = 1; i <= daysInMonth; i++) {
        const div = document.createElement('div');
        div.textContent = i;
        div.classList.add('day');
        const eventKey = `${month + 1}-${i}`;
        if (events[eventKey]) {
            div.classList.add('holiday');
            div.textContent += ` ${events[eventKey]}`;
        }
        div.addEventListener('click', () => showDetails(year, month + 1, i, events[eventKey]));
        calendar.appendChild(div);
    }
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
}

function showDetails(year, month, day, event) {
    let message = `選択した日付: ${year}年${month}月${day}日`;
    if (event) {
        message += ` (${event})`;
    }
    alert(message);
}

// ページ読み込み時にカレンダーを生成
generateCalendar();
