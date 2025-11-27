# 🏫 School Management System (SMS)

A simple, modern, and functional School Management System built with HTML, CSS, JavaScript, and Supabase. This system provides separate portals for Administrators and Teachers to manage students, classes, attendance, and marks efficiently.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Supabase Configuration](#supabase-configuration)
- [Running with Docker](#running-with-docker)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Administrator Portal

- 📊 **Dashboard** - View statistics (total students, teachers, classes, attendance rate)
- 👨‍🎓 **Student Management** - Add, edit, delete, and view student records
- 👨‍🏫 **Teacher Management** - Manage teacher information and assignments
- 🏛️ **Class Management** - Create classes and assign teachers
- 📅 **Timetable View** - View and manage school timetable

### Teacher Portal

- 📊 **Dashboard** - Quick overview of classes and daily schedule
- ✅ **Attendance Management** - Mark daily attendance for students by class
- 📝 **Marks Entry** - Enter and view exam marks for students
- 📅 **Timetable View** - View personal teaching schedule
- ✔️ **Period Completion** - Mark periods as completed

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Supabase (PostgreSQL + REST API)
- **Containerization:** Docker & Docker Compose
- **HTTP Server:** http-server (Node.js)

**No backend frameworks** like PHP, Python, or Node.js servers are required - only JavaScript + Supabase!

## 📁 Project Structure

```
School-Management-System/
├── index.html                 # Main login/portal selection page
├── admin/                     # Administrator portal
│   ├── dashboard.html        # Admin dashboard
│   ├── students.html         # Student management
│   ├── teachers.html         # Teacher management
│   ├── classes.html          # Class management
│   ├── timetable.html        # Timetable view
│   ├── admin.js              # Admin-specific JavaScript
│   └── admin.css             # Admin-specific styles
├── teacher/                   # Teacher portal
│   ├── dashboard.html        # Teacher dashboard
│   ├── attendance.html       # Attendance marking
│   ├── marks.html            # Marks entry
│   ├── timetable.html        # Teacher timetable
│   ├── teacher.js            # Teacher-specific JavaScript
│   └── teacher.css           # Teacher-specific styles
├── shared/                    # Shared resources
│   ├── supabase.js           # Supabase client configuration
│   ├── api.js                # Reusable API functions
│   └── styles.css            # Shared CSS styles
├── schema.sql                # Database schema for Supabase
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose configuration
├── .dockerignore             # Docker ignore file
└── README.md                 # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Docker** (optional, for containerized deployment) - [Download](https://www.docker.com/)
- **Supabase Account** - [Sign up](https://supabase.com/)
- **Modern Web Browser** (Chrome, Firefox, Edge, Safari)

## 🚀 Installation & Setup

### Option 1: Local Setup (Without Docker)

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/School-Management-System.git
   cd School-Management-System
   ```

2. **Install http-server globally**

   ```bash
   npm install -g http-server
   ```

3. **Configure Supabase** (see [Supabase Configuration](#supabase-configuration) below)

4. **Start the server**

   ```bash
   http-server -p 8080 -c-1
   ```

5. **Open your browser**
   ```
   http://localhost:8080
   ```

### Option 2: Docker Setup (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/School-Management-System.git
   cd School-Management-System
   ```

2. **Configure Supabase** (see [Supabase Configuration](#supabase-configuration) below)

3. **Build and run with Docker Compose**

   ```bash
   docker-compose up -d
   ```

4. **Access the application**

   ```
   http://localhost:8080
   ```

5. **View logs (optional)**

   ```bash
   docker-compose logs -f
   ```

6. **Stop the application**
   ```bash
   docker-compose down
   ```

## 🔧 Supabase Configuration

### Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and create an account
2. Click "New Project"
3. Fill in project details:
   - **Name:** School Management System
   - **Database Password:** Choose a strong password
   - **Region:** Select closest to your location
4. Wait for the project to be created (~2 minutes)

### Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 3: Update Configuration

1. Open `shared/supabase.js`
2. Replace the placeholders with your credentials:
   ```javascript
   const SUPABASE_URL = "https://your-project.supabase.co";
   const SUPABASE_ANON_KEY = "your-anon-key-here";
   ```

### Step 4: Set Up Database

1. In Supabase dashboard, go to **SQL Editor**
2. Open the `schema.sql` file from this project
3. Copy the entire content and paste it into the SQL Editor
4. Click **Run** to execute the schema
5. Verify tables are created under **Table Editor**

### Step 5: Add Supabase Library

The Supabase JavaScript library is loaded via CDN. Add this line to each HTML file before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

## 🐳 Running with Docker

### Build the Docker Image

```bash
docker build -t school-management-system .
```

### Run the Container

```bash
docker run -d -p 8080:8080 --name sms-app school-management-system
```

### Using Docker Compose (Preferred)

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f sms-web

# Stop the application
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

### Docker Commands Reference

```bash
# List running containers
docker ps

# Stop container
docker stop school-management-system

# Remove container
docker rm school-management-system

# View container logs
docker logs school-management-system

# Access container shell
docker exec -it school-management-system sh
```

## 📖 Usage

### For Administrators

1. **Access Admin Portal:** Click "Administrator Portal" on the home page
2. **Dashboard:** View overall statistics and quick actions
3. **Manage Students:** Add new students, edit details, or remove students
4. **Manage Teachers:** Add teachers with subject assignments
5. **Create Classes:** Set up classes and assign class teachers
6. **View Timetable:** Check the school-wide timetable

### For Teachers

1. **Access Teacher Portal:** Click "Teacher Portal" on the home page
2. **Dashboard:** View your classes and today's schedule
3. **Mark Attendance:**
   - Select class and date
   - Mark each student as Present/Absent
   - Submit attendance
4. **Enter Marks:**
   - Select class, subject, and exam
   - Enter marks for each student (0-100)
   - Submit marks
5. **View Timetable:** Check your teaching schedule and mark periods as completed

### Keyboard Shortcuts (Teacher Portal)

- **Ctrl + P:** Mark all students present
- **Ctrl + A:** Mark all students absent

## 🗄️ Database Schema

### Tables

1. **students**

   - `id` (UUID, Primary Key)
   - `name` (Text)
   - `class` (Text)
   - `admission_no` (Text, Unique)
   - `created_at` (Timestamp)

2. **teachers**

   - `id` (UUID, Primary Key)
   - `name` (Text)
   - `subject` (Text)
   - `email` (Text, Unique)
   - `created_at` (Timestamp)

3. **classes**

   - `id` (UUID, Primary Key)
   - `name` (Text, Unique)
   - `teacher_id` (UUID, Foreign Key → teachers)

4. **attendance**

   - `id` (UUID, Primary Key)
   - `student_id` (UUID, Foreign Key → students)
   - `date` (Date)
   - `status` (Boolean)
   - `marked_by` (UUID, Foreign Key → teachers)
   - `created_at` (Timestamp)

5. **marks**
   - `id` (UUID, Primary Key)
   - `student_id` (UUID, Foreign Key → students)
   - `subject` (Text)
   - `exam` (Text)
   - `marks` (Integer, 0-100)
   - `entered_by` (UUID, Foreign Key → teachers)
   - `created_at` (Timestamp)

### Views

- `student_attendance_summary` - Attendance percentage for each student
- `student_marks_summary` - Marks with grades for all students
- `class_performance` - Average, highest, and lowest marks by class

### Functions

- `calculate_attendance_percentage(student_id, start_date, end_date)`
- `get_student_average(student_id, exam)`

## 📸 Screenshots

> **Note:** Add screenshots of your application here

### Admin Portal

- Dashboard with statistics
- Student management interface
- Teacher management interface
- Class management interface

### Teacher Portal

- Teacher dashboard
- Attendance marking interface
- Marks entry interface
- Timetable view

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Parent portal for viewing student progress
- [ ] Real-time notifications
- [ ] Report card generation (PDF export)
- [ ] SMS/Email notifications for attendance
- [ ] Dynamic timetable management
- [ ] Fee management module
- [ ] Library management
- [ ] Student profile with photos
- [ ] Advanced analytics and charts
- [ ] Mobile responsive design improvements
- [ ] Progressive Web App (PWA) support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **H. H. Arunoda Abeywardhana** - Initial work

## 🙏 Acknowledgments

- Supabase for providing an excellent backend platform
- All contributors and testers

## 📞 Support

For support, email arunodaabey2001@gmail.com or create an issue in the repository.

---

**Made with ❤️ for educational purposes**
