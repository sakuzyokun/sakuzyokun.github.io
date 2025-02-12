function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('clock').innerText = `${hours}:${minutes}:${seconds}`;
}

function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    startMenu.style.display = startMenu.style.display === 'none' ? 'flex' : 'none';
}

function openCopilotApp() {
    toggleWindow('copilot-app');
    toggleStartMenu(); // Startメニューを閉じる
}

function openFileExplorer() {
    toggleWindow('file-explorer');
    toggleStartMenu(); // Startメニューを閉じる
}

function toggleWindow(windowId) {
    const window = document.getElementById(windowId);
    window.style.display = window.style.display === 'none' ? 'flex' : 'none';
}

function closeWindow(windowId) {
    document.getElementById(windowId).style.display = 'none';
}

function generateCalendar() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();
    let calendarHtml = `<h3>${year}年${month}月</h3>`;
    calendarHtml += '<table><tr>';
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    for (const day of daysOfWeek) {
        calendarHtml += `<th>${day}</th>`;
    }
    calendarHtml += '</tr><tr>';
    for (let i = 1; i <= daysInMonth; i++) {
        if (new Date(year, month - 1, i).getDay() === 0 && i !== 1) {
            calendarHtml += '</tr><tr>';
        }
        calendarHtml += `<td>${i}</td>`;
    }
    calendarHtml += '</tr></table>';
    document.getElementById('calendar').innerHTML = calendarHtml;
}

function showNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    setInterval(updateClock, 1000);
    generateCalendar();
    showNotification();
});
