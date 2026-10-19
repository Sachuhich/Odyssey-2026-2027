import { usersDatabase } from './users.js';

let selectedUserName = null;

export function renderTierlist() {
    const ratingContainer = document.getElementById('rating-list');
    if (!ratingContainer) return;

    ratingContainer.innerHTML = ""; 

    const processedUsers = usersDatabase.map(user => {
        const totalSum = user.kostiks.reduce((sum, current) => sum + current, 0);
        return { name: user.name, points: totalSum, originalKostiks: user.kostiks };
    });

    const activeUsers = processedUsers.filter(user => user.points > 0);
    const zeroUsers = processedUsers.filter(user => user.points === 0);

    // УМНАЯ СОРТИРОВКА: сначала по баллам (убывание), а при равенстве — по алфавиту (А-Я)
    activeUsers.sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points; // Если баллы разные, сортируем по баллам
        }
        return a.name.localeCompare(b.name); // Если баллы равны, сортируем по алфавиту имён
    });

    zeroUsers.sort((a, b) => a.name.localeCompare(b.name));

    activeUsers.forEach((user, index) => {
        createRatingRow(user, `${index + 1}.`, false, ratingContainer);
    });

    if (zeroUsers.length > 0) {
        const zeroSection = document.createElement('div');
        zeroSection.className = 'zero-users-section';
        
        zeroUsers.forEach(user => {
            createRatingRow(user, "", true, zeroSection);
        });

        ratingContainer.appendChild(zeroSection);
    }
}

function createRatingRow(user, placeMarker, isZero, container) {
    const row = document.createElement('div');
    row.className = `rating-row ${isZero ? 'zero-row' : ''} ${user.name === selectedUserName ? 'selected' : ''}`;
    row.style.cursor = 'pointer'; 

    row.onclick = function(e) {
        e.stopPropagation();
        toggleHistoryPanel(user.name);
    };

    if (!isZero) {
        row.innerHTML = `
            <span class="rating-position">${placeMarker}</span>
            <span class="rating-name">${user.name}</span>
            <span class="rating-score">${user.points} 🦴</span>
        `;
    } else {
        row.innerHTML = `
            <span class="rating-name">${user.name}</span>
            <span class="rating-score">${user.points} 🦴</span>
        `;
    }

    container.appendChild(row);

    if (user.name === selectedUserName) {
        const panel = document.createElement('div');
        panel.className = 'rating-details-panel';
        panel.onclick = function(e) { e.stopPropagation(); }; 

        if (user.points > 0) {
            const mathematicalString = user.originalKostiks.join(' + ');
            panel.innerHTML = `<div class="history-text">${mathematicalString} = ${user.points} 🦴</div>`;
        } else {
            panel.innerHTML = `<div class="history-text italic-text">Боец не участвовал в активностях</div>`;
        }

        container.appendChild(panel);
    }
}

function toggleHistoryPanel(userName) {
    if (selectedUserName === userName) {
        selectedUserName = null; 
    } else {
        selectedUserName = userName; 
    }
    renderTierlist(); 
}

document.addEventListener('click', function() {
    if (selectedUserName !== null) {
        selectedUserName = null;
        renderTierlist();
    }
});ф
