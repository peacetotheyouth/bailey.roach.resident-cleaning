# 🧹 Resident Cleaning Task Manager

A beautiful web application for managing residential cleaning tasks and schedules.

## About

Hi, I'm @peacetotheyouth (Bailey Roach)! 👋
- 👀 I'm interested in many things, mainly those that intellectually stimulate me like poker, chess, learning new things.
- 🌱 I'm currently studying to be a trauma and child developmental therapist, but I've always had a knack and liking for code.
- 💞️ I'm looking to collaborate on web development.
- 📫 How to reach me: 210-214-3408 and baileyroachh@gmail.com

## Features

✨ **Beautiful, Modern UI** - Clean and intuitive interface with gradient backgrounds
📋 **Task Management** - Create, assign, and track cleaning tasks
👥 **Resident Assignment** - Assign tasks to specific residents
📅 **Schedule Tracking** - Keep track of due dates and completion status
✅ **Status Updates** - Monitor task progress in real-time

## Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/peacetotheyouth/bailey.roach.resident-cleaning.git
cd bailey.roach.resident-cleaning
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

### Running the Website

Start the server:
```bash
npm start
```

The website will be accessible at **http://localhost:3000** 🌐

## Access Instantly

Once the server is running, you can access the website instantly by opening:
- http://localhost:3000 in your web browser

No database setup required for the basic functionality - the application includes sample data to get you started!

## Database Configuration (Optional)

For persistent data storage, this project includes PostgreSQL database configuration:

1. Install PostgreSQL
2. Create a database
3. Configure environment variables in `.env` file
4. See `config/README.md` for detailed database setup instructions

## Project Structure

```
bailey.roach.resident-cleaning/
├── server.js           # Express server
├── package.json        # Dependencies
├── public/             # Frontend files
│   ├── index.html     # Main webpage
│   ├── styles.css     # Styling
│   └── app.js         # Client-side JavaScript
├── config/             # Database configuration
│   ├── database.js
│   ├── database.json
│   └── README.md
├── .env.example       # Environment variables template
└── README.md          # This file
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: PostgreSQL (optional)
- **ORM**: Sequelize

## Screenshots

Visit http://localhost:3000 to see:
- Clean, modern homepage with gradient design
- Task cards showing cleaning assignments
- Feature overview section
- Contact information

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT License - Feel free to use this project for your own purposes!

## Contact

- 📧 Email: baileyroachh@gmail.com
- 📱 Phone: 210-214-3408
- 💻 GitHub: [@peacetotheyouth](https://github.com/peacetotheyouth)
