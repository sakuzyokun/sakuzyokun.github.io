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

function showYear() {
    const calendarBody = document.getElementById('calendarBody');
    calendarBody.innerHTML = '';

    for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
        const firstDay = new Date(currentYear, month).getDay();

        const monthRow = document.createElement('tr');
        const monthCell = document.createElement('td');
        monthCell.colSpan = 7;
        monthCell.innerHTML = `<strong>${currentYear}年 ${month + 1}月</strong>`;
        monthRow.appendChild(monthCell);
        calendarBody.appendChild(monthRow);

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
                    const cellDate = `${currentYear}-${month + 1}-${date}`;
                    if (events[cellDate]) {
                        cell.innerHTML += `<div>${events[cellDate]}</div>`;
                    }
                    date++;
                }
                row.appendChild(cell);
            }

            calendarBody.appendChild(row);
        }
    }
}

function showWeek() {
    const selectedDate = today;
    const startDate = new Date(selectedDate.setDate(selectedDate.getDate() - selectedDate.getDay()));
    const calendarBody = document.getElementById('calendarBody');
    calendarBody.innerHTML = '';

    const weekRow = document.createElement('tr');
    for (let i = 0; i < 7; i++) {
        const cell = document.createElement('td');
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const cellDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        cell.innerHTML = date.getDate();
        if (events[cellDate]) {
            cell.innerHTML += `<div>${events[cellDate]}</div>`;
        }
        weekRow.appendChild(cell);
    }
    calendarBody.appendChild(weekRow);

    document.getElementById('monthYear').innerText = `${startDate.getFullYear()}年 ${startDate.getMonth() + 1}月 第${Math.ceil((startDate.getDate() + 1) / 7)}週`;
}

function goToDate() {
    const datePicker = document.getElementById('datePicker').value;
    const selectedDate = new Date(datePicker);
    currentYear = selectedDate.getFullYear();
    currentMonth = selectedDate.getMonth();
    showCalendar(currentMonth, currentYear);
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
