require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API routes for cleaning tasks (mock data for now)
app.get('/api/tasks', (req, res) => {
  const mockTasks = [
    {
      id: 1,
      title: 'Kitchen Cleaning',
      description: 'Clean counters, sink, and appliances',
      assignedTo: 'Bailey',
      status: 'pending',
      dueDate: '2026-02-01'
    },
    {
      id: 2,
      title: 'Bathroom Cleaning',
      description: 'Clean toilet, shower, and mirrors',
      assignedTo: 'Resident A',
      status: 'completed',
      dueDate: '2026-01-30'
    },
    {
      id: 3,
      title: 'Living Room Vacuuming',
      description: 'Vacuum carpets and furniture',
      assignedTo: 'Resident B',
      status: 'in-progress',
      dueDate: '2026-02-02'
    }
  ];
  res.json(mockTasks);
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ Resident Cleaning website is running on http://localhost:${PORT}`);
  console.log(`🌐 Access it instantly at http://localhost:${PORT}`);
});
