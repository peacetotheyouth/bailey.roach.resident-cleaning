// Fetch and display tasks
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
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
            
            taskCard.innerHTML = `
                <h3>${task.title}</h3>
                <p><strong>Description:</strong> ${task.description}</p>
                <p><strong>Assigned to:</strong> ${task.assignedTo}</p>
                <p><strong>Due Date:</strong> ${formatDate(task.dueDate)}</p>
                <span class="task-status ${task.status}">${formatStatus(task.status)}</span>
            `;
            
            container.appendChild(taskCard);
        });
    } catch (error) {
        console.error('Error loading tasks:', error);
        const container = document.getElementById('tasks-container');
        container.innerHTML = '<div class="loading">Error loading tasks. Please try again later.</div>';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
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
