const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const events = {};

function showCalendar(month, year) {
    const firstDay = new Date(year, month).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarBody = document.getElementById('calendarBody');
    calendarBody.innerHTML = '';

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                cell.innerHTML = '';
            } else if (date > daysInMonth) {
                break;
            } else {
                cell.innerHTML = date;
                const cellDate = `${year}-${month + 1}-${date}`;
                if (events[cellDate]) {
                    cell.innerHTML += `<div>${events[cellDate]}</div>`;
                }
                if (year === today.getFullYear() && month === today.getMonth() && date === today.getDate()) {
                    cell.classList.add('today');
                }
                date++;
            }
            row.appendChild(cell);
        }

        calendarBody.appendChild(row);
    }

    document.getElementById('monthYear').innerText = `${year}年 ${month + 1}月`;
}

function addEvent() {
    const eventInput = document.getElementById('eventInput').value;
    if (!eventInput) {
        alert("予定を入力してください");
        return;
    }
    const eventDate = '2038-1-19';
    events[eventDate] = eventInput;
    showCalendar(currentMonth, currentYear);
}

function prevMonth() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function nextMonth() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
    showCalendar(currentMonth, currentYear);
}

showCalendar(currentMonth, currentYear);
