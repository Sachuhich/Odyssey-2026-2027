import { myEvents } from './events.js';
import { renderTierlist } from './tierlist.js';


window.switchPage = function(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.main-nav .nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
};

function getColorClass(type) {
    switch (type.toLowerCase()) {
        case 'одиссея': 
            return 'bg-odyssey';
        case 'шсо': 
            return 'bg-shso';
        case 'спбсо': 
            return 'bg-spbso';
        case 'молодёжный':
        case 'молодежный': 
            return 'bg-youth';
        default: 
            return 'bg-other';
    }
}


const monthsTimeline = [
    { name: "Октябрь", year: 2026, monthIndex: 9 },
    { name: "Ноябрь", year: 2026, monthIndex: 10 },
    { name: "Декабрь", year: 2026, monthIndex: 11 },
    { name: "Январь", year: 2027, monthIndex: 0 },
    { name: "Февраль", year: 2027, monthIndex: 1 },
    { name: "Март", year: 2027, monthIndex: 2 },
    { name: "Апрель", year: 2027, monthIndex: 3 },
    { name: "Май", year: 2027, monthIndex: 4 },
    { name: "Июнь", year: 2027, monthIndex: 5 },
    { name: "Июль", year: 2027, monthIndex: 6 },
    { name: "Август", year: 2027, monthIndex: 7 },
    { name: "Сентябрь", year: 2027, monthIndex: 8 }, 
    { name: "Октябрь", year: 2027, monthIndex: 9 }   
];

let activeMonthIndex = 1; 
let selectedDateKey = null;

const monthTabsContainer = document.getElementById('month-tabs');
monthTabsContainer.innerHTML = ""; 

const emptyStartBtn = document.createElement('div');
emptyStartBtn.className = 'month-btn-empty'; 
monthTabsContainer.appendChild(emptyStartBtn);

monthsTimeline.forEach((m, index) => {
    let btn = document.createElement('button');
    btn.className = 'month-btn';
    if(index === activeMonthIndex) btn.classList.add('active');
    btn.textContent = m.name;
    btn.onclick = function(e) {
        e.stopPropagation(); 
        document.querySelectorAll('.month-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeMonthIndex = index;
        selectedDateKey = null; 
        renderMonth(activeMonthIndex);
    };
    monthTabsContainer.appendChild(btn);
});

function renderMonth(index) {
    const currentMonthData = monthsTimeline[index];
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = ""; 
    
    let firstDayOfWeek = new Date(currentMonthData.year, currentMonthData.monthIndex, 1).getDay();
    let shiftStart = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    for (let i = 0; i < shiftStart; i++) {
        let emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-day';
        emptyDiv.onclick = function(e) {
            e.stopPropagation();
            selectedDateKey = null; 
            renderMonth(activeMonthIndex); 
        };
        grid.appendChild(emptyDiv);
    }
    
    const daysInMonth = new Date(currentMonthData.year, currentMonthData.monthIndex + 1, 0).getDate();
    
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const mm = String(currentMonthData.monthIndex + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        const dateKey = `${currentMonthData.year}-${mm}-${dd}`;
        
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        
        if (dateKey === todayKey) dayCard.classList.add('today');
        if (dateKey === selectedDateKey) dayCard.classList.add('selected');
        
        const dayNo = document.createElement('div');
        dayNo.className = 'day-number';
        dayNo.textContent = day;
        dayCard.appendChild(dayNo);
        
        if (myEvents[dateKey] && myEvents[dateKey].length > 0) {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'event-dots-container';
            
            myEvents[dateKey].forEach(ev => {
                const dot = document.createElement('div');
                dot.className = `event-dot-mini ${getColorClass(ev.type)}`;
                dotsContainer.appendChild(dot);
            });
            dayCard.appendChild(dotsContainer);
        }
        
        dayCard.onclick = function(e) {
            e.stopPropagation(); 
            toggleDetailsPanel(dateKey);
        };
        
        grid.appendChild(dayCard);
    }

    let totalCellsSoFar = shiftStart + daysInMonth;
    let shiftEnd = (7 - (totalCellsSoFar % 7)) % 7;

    for (let i = 0; i < shiftEnd; i++) {
        let emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-day';
        emptyDiv.onclick = function(e) {
            e.stopPropagation();
            selectedDateKey = null; 
            renderMonth(activeMonthIndex); 
        };
        grid.appendChild(emptyDiv);
    }
    
    if (selectedDateKey) {
        insertDetailsPanelInline();
    }
}

function toggleDetailsPanel(dateKey) {
    if (selectedDateKey === dateKey) {
        selectedDateKey = null;
    } else {
        selectedDateKey = dateKey;
    }
    renderMonth(activeMonthIndex);
}

function insertDetailsPanelInline() {
    const grid = document.getElementById('calendar-grid');
    const cards = Array.from(grid.children);
    let targetIndex = -1;
    
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].classList.contains('selected')) {
            targetIndex = i;
            break;
        }
    }
    
    if (targetIndex === -1) return;
    
    let rowEndIndex = Math.ceil((targetIndex + 1) / 7) * 7 - 1;
    if (rowEndIndex >= cards.length) rowEndIndex = cards.length - 1;
    
    const panel = document.createElement('div');
    panel.className = 'details-panel';
    
    panel.onclick = function(e) {
        e.stopPropagation(); 
    };
    
    const dayEvents = myEvents[selectedDateKey];
    if (dayEvents && dayEvents.length > 0) {
        dayEvents.forEach(ev => {
            const dev = document.createElement('div');
            dev.className = `detail-item ${getColorClass(ev.type)}`;
            
            let innerHTML = `<div class="event-title" style="font-weight: bold; font-size: 16px;">${ev.event}</div>`;
            
            if (ev.time && ev.time.trim() !== "") {
                innerHTML += `<div class="event-time">⏰ ${ev.time}</div>`;
            }
            
            if (ev.text && ev.text.trim() !== "") {
                innerHTML += `<div class="event-text">${ev.text}</div>`;
            }
            
            dev.innerHTML = innerHTML;
            panel.appendChild(dev);
        });
    } else {
        panel.classList.add('no-border-panel'); 
        
        const noEvent = document.createElement('div');
        noEvent.style.color = '#888';
        noEvent.style.textAlign = 'center';
        noEvent.textContent = "В этот день нет мероприятий.";
        panel.appendChild(noEvent);
    }
    
    if (rowEndIndex === cards.length - 1) {
        grid.appendChild(panel);
    } else {
        grid.insertBefore(panel, cards[rowEndIndex + 1]);
    }
}


document.addEventListener('click', function() {
    if (selectedDateKey !== null) {
        selectedDateKey = null;
        renderMonth(activeMonthIndex);
    }
});

renderMonth(activeMonthIndex);
renderTierlist();
