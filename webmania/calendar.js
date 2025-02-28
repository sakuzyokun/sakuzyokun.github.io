const calendar = document.getElementById('calendar');
const currentDateElem = document.getElementById('current-date');
const yearSelect = document.getElementById('year');
const monthlyWallpaperElem = document.getElementById('monthly-wallpaper');
let currentDate = new Date();

const monthImages = [
    '画像URL1',
    '画像URL2',
    '画像URL3',
    '画像URL4',
    '画像URL5',
    '画像URL6',
    '画像URL7',
    '画像URL8',
    '画像URL9',
    '画像URL10',
    '画像URL11',
    '画像URL12'
];

const events = {
    '1-5': 'ポケ鉄、きらめき 誕生日',
    '2-2': 'ゆーゆー 誕生日',
    '2-8': '直孤 誕生日',
    '2-19': 'みっくる 誕生日',
    '2-20': 'あおどら 誕生日',
    '2-24': 'ぺゅー 誕生日',
    '3-2': 'Tsubumame 誕生日',
    '3-5': 'じば 誕生日',
    '3-14': 'ゼノデュース 誕生日',
    '4-13': 'cassis 誕生日',
    '5-1': 'ろいろい 誕生日、令和改元',
    '5-6': 'ゆきらわ 誕生日',
    '5-20': 'しかゆ 誕生日、成田空港開港記念日',
    '6-3': 'tama 誕生日',
    '6-6': '削除くん 誕生日',
    '6-8': 'starfall spring 誕生日',
    '7-6': 'れいみん 誕生日',
    '7-30': 'My 誕生日',
    '8-1': 'めろん 誕生日',
    '8-13': 'まぐまぐろ 誕生日',
    '8-18': '熊野友二 誕生日',
    '9-1': 'お団子君 誕生日',
    '9-17': 'ちび式じい 誕生日',
    '10-8': 'けいちゃん 誕生日',//(未公開)ウェブマニア 誕生日かも
    '10-20': 'サーバー建設記念日',
    '11-19': '夢野ふの 誕生日',
    '12-14': 'ふみゆき 誕生日',
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

// 今日の日付
const today = new Date();

function updateBackground() {
    document.body.style.backgroundImage = monthImages[currentDate.getMonth()];
}

function updateCurrentDate() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    currentDateElem.textContent = `${year}年${month}月`;
}

function updateMonthlyWallpaper() {
    const monthIndex = currentDate.getMonth();
    const monthImageURL = monthImages[monthIndex];
    monthlyWallpaperElem.innerHTML = `今月の壁紙はこれです: <button onclick="showWallpaper('${monthImageURL}')">表示</button>`;
}

function showWallpaper(url) {
    const wallpaperWindow = window.open("", "今月の壁紙", "width=800,height=600");
    wallpaperWindow.document.write(`<img src="${url}" style="width:100%;height:100%;">`);
}

function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 背景画像を更新
    updateBackground();
    // 現在の年月を更新
    updateCurrentDate();
    // 今月の壁紙を更新
    updateMonthlyWallpaper();

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

        // 今日の日付を赤くする
        if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
            div.classList.add('today');
        }

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
        message += ` \nイベント: ${event}`;
    }
    alert(message);
}

// ページ読み込み時にカレンダーを生成
generateCalendar();
