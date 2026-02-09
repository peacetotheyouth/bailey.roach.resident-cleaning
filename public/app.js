// Fetch and display tasks
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
            console.error('Failed to load tasks. HTTP status:', response.status);
            const container = document.getElementById('tasks-container');
            let message = 'Error loading tasks. Please try again later.';
            if (response.status === 429) {
                message = 'Too many requests. Please wait a moment and try again.';
            }
            container.innerHTML = '<div class="loading">' + message + '</div>';
            return;
        }
        const tasks = await response.json();
        
        const container = document.getElementById('tasks-container');
        container.innerHTML = '';
        
        if (tasks.length === 0) {
            container.innerHTML = '<div class="loading">No tasks available</div>';
            return;
        }
        
        tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = `task-card ${task.status}`;

            const titleEl = document.createElement('h3');
            titleEl.textContent = task.title ?? '';

            const descP = document.createElement('p');
            const descStrong = document.createElement('strong');
            descStrong.textContent = 'Description:';
            descP.appendChild(descStrong);
            descP.appendChild(document.createTextNode(' ' + (task.description ?? '')));

            const assignedP = document.createElement('p');
            const assignedStrong = document.createElement('strong');
            assignedStrong.textContent = 'Assigned to:';
            assignedP.appendChild(assignedStrong);
            assignedP.appendChild(document.createTextNode(' ' + (task.assignedTo ?? '')));

            const dueP = document.createElement('p');
            const dueStrong = document.createElement('strong');
            dueStrong.textContent = 'Due Date:';
            dueP.appendChild(dueStrong);
            dueP.appendChild(document.createTextNode(' ' + formatDate(task.dueDate)));

            const statusSpan = document.createElement('span');
            statusSpan.className = `task-status ${task.status}`;
            statusSpan.textContent = formatStatus(task.status);

            taskCard.appendChild(titleEl);
            taskCard.appendChild(descP);
            taskCard.appendChild(assignedP);
            taskCard.appendChild(dueP);
            taskCard.appendChild(statusSpan);
            container.appendChild(taskCard);
        });
    } catch (error) {
        console.error('Error loading tasks:', error);
        const container = document.getElementById('tasks-container');
        container.innerHTML = '<div class="loading">Error loading tasks. Please try again later.</div>';
    }
}

function formatDate(dateString) {
    // Guard against missing or empty date strings
    if (!dateString) {
        return '';
    }

    const date = new Date(dateString);

    // Guard against unparseable dates that would render "Invalid Date"
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatStatus(status) {
    return status
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    
    // Refresh tasks every 30 seconds
    setInterval(loadTasks, 30000);
});
