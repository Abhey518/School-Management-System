# 🏫 School Management System

A modern, web-based School Management System built with vanilla JavaScript and Supabase. This system provides comprehensive portals for administrators and teachers to efficiently manage students, classes, attendance, marks, and academic operations.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![Supabase](https://img.shields.io/badge/Backend-Supabase-green.svg)

## 🌟 Overview

The School Management System is a lightweight, full-featured web application designed to streamline school administration and teaching operations. Built without heavy frameworks, it leverages modern JavaScript and Supabase's powerful backend-as-a-service platform to deliver a responsive and intuitive user experience.

## ✨ Key Features

### 👨‍💼 Administrator Portal

- **Dashboard Analytics** - Real-time statistics on students, teachers, classes, and attendance rates
- **Student Management** - Complete CRUD operations for student records
- **Teacher Management** - Manage teacher profiles and subject assignments
- **Class Management** - Create and organize classes with teacher assignments
- **Subject Management** - Define subjects and assign them to classes
- **Marks Approval System** - Review and approve marks submitted by teachers
- **Timetable Management** - View and manage school-wide timetables
- **System Settings** - Customize school name, theme colors, and system preferences
- **Notifications** - Real-time notification system for marks submissions and requests

### 👨‍🏫 Teacher Portal

- **Personal Dashboard** - Overview of assigned classes and daily schedule
- **Attendance Tracking** - Mark and manage daily student attendance
- **Marks Entry** - Submit student marks for various subjects and exams
- **Marks Recheck** - Handle recheck requests from administrators
- **Timetable View** - Access personal teaching schedule
- **Period Management** - Mark teaching periods as completed
- **Account Settings** - Manage personal profile and preferences
- **Notifications** - Receive updates on recheck requests and system announcements

### 🔐 Authentication & Security

- Secure user authentication via Supabase Auth
- Role-based access control (Admin/Teacher)
- Protected routes and API endpoints
- Secure credential management (credentials not stored in repository)

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend:** Supabase (PostgreSQL + REST API + Auth)
- **Deployment:** Docker support included
- **Server:** http-server (Node.js)

**Why Vanilla JavaScript?** This project demonstrates that powerful web applications can be built without heavy frameworks, keeping the codebase lightweight, fast, and easy to understand.

## 📁 Project Structure

```
School-Management-System/
├── index.html                      # Login page
├── README.md                       # Project documentation
├── schema.sql                      # Database schema
├── admin/                          # Administrator portal
│   ├── dashboard.html             # Admin dashboard
│   ├── students.html              # Student management
│   ├── teachers.html              # Teacher management
│   ├── classes.html               # Class management
│   ├── subjects.html              # Subject management
│   ├── marks-approval.html        # Marks approval system
│   ├── timetable.html             # Timetable view
│   ├── settings.html              # System settings
│   └── notifications.html         # Notifications
├── teacher/                        # Teacher portal
│   ├── dashboard.html             # Teacher dashboard
│   ├── attendance.html            # Attendance marking
│   ├── marks.html                 # Marks entry
│   ├── timetable.html             # Personal timetable
│   ├── notifications.html         # Notifications
│   └── account-settings.html      # Account settings
├── shared/                         # Shared resources
│   ├── supabase.js                # Supabase client
│   ├── supabase.config.example.js # Config template
│   ├── api.js                     # API utilities
│   ├── theme.js                   # Theme management
│   ├── notifications.js           # Notification system
│   └── styles.css                 # Global styles
├── Dockerfile                      # Docker configuration
├── docker-compose.yml             # Docker Compose setup
└── .gitignore                     # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Supabase Account** - [Sign up](https://supabase.com/)
- **Git** - [Download](https://git-scm.com/)
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/School-Management-System.git
   cd School-Management-System
   ```

2. **Set up Supabase**

   - Create a new project on [Supabase](https://supabase.com/)
   - Go to **Settings** → **API** and copy:
     - Project URL
     - Anon/Public Key
   - Go to **SQL Editor** and run the `schema.sql` file to set up the database

3. **Configure credentials**

   ```bash
   # Copy the example config file
   cp shared/supabase.config.example.js shared/supabase.config.js
   ```

   Edit `shared/supabase.config.js` and add your Supabase credentials:

   ```javascript
   const SUPABASE_URL = "https://your-project.supabase.co";
   const SUPABASE_ANON_KEY = "your-anon-key-here";
   ```

   **⚠️ Important:** Never commit `supabase.config.js` to Git (it's already in `.gitignore`)

4. **Install and run**

   ```bash
   # Install http-server globally
   npm install -g http-server

   # Start the development server
   http-server -p 8080 -c-1
   ```

5. **Access the application**

   Open your browser and navigate to:

   ```
   http://localhost:8080
   ```

### Docker Deployment (Optional)

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access at http://localhost:8080

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## 📖 Usage Guide

### First-Time Setup

1. After running the `schema.sql` file in Supabase, you'll need to create admin and teacher users
2. Use Supabase Authentication to create user accounts
3. Add corresponding entries in the `user_roles` table to assign roles
4. Teachers must be added to the `teachers` table with their user_id

### For Administrators

1. **Login** - Access the admin portal with admin credentials
2. **Manage Students** - Add, edit, or remove student records
3. **Manage Teachers** - Create teacher profiles and assign subjects
4. **Create Classes** - Set up classes and assign class teachers
5. **Approve Marks** - Review marks submitted by teachers
6. **Customize Settings** - Configure school name and theme colors

### For Teachers

1. **Login** - Access the teacher portal with teacher credentials
2. **Mark Attendance** - Select class and date, mark students present/absent
3. **Enter Marks** - Submit marks for students in your subjects
4. **View Schedule** - Check your teaching timetable
5. **Handle Rechecks** - Respond to mark recheck requests from admin

## 🎨 Features Highlight

### Dynamic Theming

- Customizable school name and brand colors
- Theme settings persist across sessions
- Applies to both admin and teacher portals

### Real-time Notifications

- Instant notifications for marks submissions
- Recheck request alerts
- Notification badge indicators

### Responsive Design

- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-optimized controls

### Data Validation

- Form validation for all inputs
- Marks range validation (0-100)
- Duplicate entry prevention

## 🔒 Security Features

- **Credential Protection** - Supabase credentials stored in gitignored config file
- **Authentication** - Secure login via Supabase Auth
- **Role-based Access** - Separate portals for admin and teacher roles
- **Row Level Security** - Database-level security policies (configured in Supabase)

## 📊 Database Schema

The system uses a PostgreSQL database (via Supabase) with the following main tables:

- `students` - Student information and records
- `teachers` - Teacher profiles and assignments
- `classes` - Class definitions and teacher assignments
- `subjects` - Subject catalog
- `attendance` - Daily attendance records
- `marks` - Student marks and grades
- `user_roles` - User authentication and role mapping
- `notifications` - System notifications
- `system_settings` - Application configuration

For detailed schema, see `schema.sql`

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🎓 Academic Project

This project was developed as part of the **SWST 31032 - Applied Information Systems** course.

**Purpose:** Educational demonstration of web-based school management system development using modern web technologies and cloud services.

**Note:** While this is an academic project, it is open-sourced under the MIT License to help other students and developers learn. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**H. H. Arunoda Abeywardhana**

- Email: arunodaabey2001@gmail.com
- GitHub: [Abhey518](https://github.com/Abhey518)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) - For providing an excellent backend platform
- All contributors and testers who helped improve this project

## 📞 Support

If you encounter any issues or have questions:

- Create an [issue](https://github.com/Abhey518/School-Management-System/issues)
- Email: arunodaabey2001@gmail.com

## 🗺️ Roadmap

- [ ] Parent portal for viewing student progress
- [ ] Report card generation (PDF export)
- [ ] SMS/Email notifications
- [ ] Fee management module
- [ ] Library management system
- [ ] Advanced analytics and charts
- [ ] Progressive Web App (PWA) support
- [ ] Multi-language support

---

**Made with ❤️ for educational purposes**

_This project was developed as part of the SWST 31032 - Applied Information Systems course_
