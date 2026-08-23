# 🏫 School Management System
### Modern Web-Based School Portal
**Subject:** SWST 31032 - Applied Information Systems (2nd Year)

---
## 📝 System Description
**School Management System** is a lightweight, full-featured web-based portal designed to streamline administrative control and teaching operations in schools. 

Built without heavy frameworks, it leverages modern vanilla JavaScript and Supabase's backend-as-a-service platform to deliver a responsive, secure, and intuitive user experience. The system provides comprehensive, role-based dashboards for administrators and teachers to efficiently manage students, classes, attendance, marks, and timetables.

---
## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Backend & Database:** Supabase (PostgreSQL, REST API, Supabase Authentication, Row Level Security)
* **Server & Deployment:** http-server (Node.js), Docker, Docker Compose
* **Collaboration & Tools:** Git, GitHub, VS Code

---
## 🎯 Main Features & Responsibilities

### 1. Administrator Portal
* **Dashboard Analytics:** Real-time statistics on students, teachers, classes, and attendance rates.
* **Student & Teacher Management:** Complete CRUD operations for student and teacher profiles.
* **Class & Subject Management:** Create and organize classes, define subjects, and assign teachers.
* **Marks Approval System:** Review and approve marks submitted by teachers.
* **Timetable & Settings:** View and manage school-wide timetables and customize system preferences (school name, theme colors).
* **Notifications:** Real-time notification system for marks submissions and requests.

### 2. Teacher Portal 
* **Personal Dashboard:** Overview of assigned classes and daily teaching schedule.
* **Attendance Tracking:** Mark and manage daily student attendance.
* **Marks Entry & Recheck:** Submit student marks for various subjects and handle recheck requests.
* **Timetable & Period Management:** Access personal teaching timetable and mark periods as completed.
* **Account Settings:** Manage personal profile and preferences.
* **Notifications:** Receive updates on recheck requests and system announcements.

### 3. Authentication & Security
* **Supabase Authentication:** Secure user signup and signin with role-based allocation (Admin/Teacher).
* **Role-Based Access Control (RBAC):** Portal redirection and page-level guards.
* **Database Security:** Secure credential storage and Row Level Security (RLS) policies.

---
## ⚙️ Installation & Setup

### Prerequisites
* **Node.js** (v18 or higher)
* **Git**
* **Docker & Docker Compose** *(Optional, for containerized deployment)* — [Download Docker](https://www.docker.com/)
* **Modern web browser** (Chrome, Firefox, Safari, or Edge)
* **Supabase Account** — (https://supabase.com/)

---
### Step 1: Set up the Database (Supabase)

**The application uses Supabase for user authentication, database management (PostgreSQL), and real-time features.**

#### 1.1 Create a New Project

1. Log in to your **Supabase Dashboard**.
2. Click **New Project** and select your organization.
3. Set a **Project Name** (e.g., `School Management System`).
4. Set a strong **Database Password** (save this password somewhere secure).
5. Choose a region close to you and click **Create New Project**. Wait a few minutes for the project database to provision.

#### 1.2 Initialize Database Schema

1. Once the database is ready, navigate to the **SQL Editor** from the left navigation panel.
2. Click on **New Query**.
3. Open the `schema.sql` file located in the root of the project repository.
4. Copy the entire contents of `schema.sql` and paste it into the Supabase SQL editor.
5. Click **Run** to create the tables, indexes, and trigger functions.

---
### Step 2: Project Configuration

**To connect your frontend application to the Supabase backend services, you need to configure your local credentials.**

#### 2.1 Retrieve API Credentials

1. In the Supabase Dashboard, go to **Project Settings** (the cog icon at the bottom of the left sidebar) ➔ **API**.
2. Copy the following values:
   * **Project URL** (under Config ➔ URL)
   * **Anon Public Key** (under API Keys ➔ `anon` `public`)

#### 2.2 Configure Local Config File

1. Open your terminal and navigate to the project directory:
```bash
   cd School-Management-System
```

2. Copy the configuration template:
```bash
# Windows PowerShell / CMD:
copy shared\supabase.config.example.js shared\supabase.config.js

# Linux / macOS:
cp shared/supabase.config.example.js shared/supabase.config.js
```

3. Open `shared/supabase.config.js` in your code editor and replace the placeholder values with your Supabase credentials:
```javascript
const SUPABASE_URL = "https://your-supabase-project.supabase.co";

const SUPABASE_ANON_KEY = "your-supabase-anon-key-here";
```

⚠️ **Security Warning**: Never commit `shared/supabase.config.js` to GitHub. The file is already ignored in the project's `.gitignore` to prevent leaking database keys.

---
### Step 3: Running the Application

**You can launch the web application either using a local Node.js development server or using Docker.**
#### Option A: Local Run (Recommended)

This option runs a lightweight HTTP server to serve the HTML, CSS, and JS files natively.

1. Open your terminal in the project directory.
2. Install `http-server` globally:
```bash
    npm install -g http-server
```

3. Start the development server (configured to avoid file caching):
```bash
    http-server -p 8080 -c-1
```

4. Access the web app in your browser at: **[http://localhost:8080](http://localhost:8080/)**

---
#### Option B: Docker Container Deployment

If you prefer running the application inside a containerized environment:

1. Build and start the container in detached mode:
```bash
    docker-compose up -d
```

2. Access the portal in your browser at: **[http://localhost:8080](http://localhost:8080/)**
3. To view runtime logs, run:
```bash
	docker-compose logs -f
```

4. To stop the application, run:
```bash
	docker-compose down
```

---
### Step 4: First-Time User Setup

**After configuring the project, you must set up user accounts in Supabase to log in as an administrator or teacher.**

#### 4.1 Create Authentication Users

1. Go to the **Authentication** tab in your Supabase dashboard.
2. Click **Add User** ➔ **Create User**.
3. Enter the email address and password for your user account (e.g., `admin@school.com` or `teacher@school.com`).
4. Copy the newly created user's **User ID** (UUID) from the dashboard list.

#### 4.2 Assign System Roles (`user_roles` Table)

1. Go to the **Table Editor** tab on the left sidebar.
2. Select the `user_roles` table.
3. Click **Insert Row**.
4. Paste the user's UUID into the `user_id` field.
5. In the `role` field, enter either `'admin'` or `'teacher'` (match the role intended for the user).
6. Click **Save**.

#### 4.3 Setup Teacher Profiles (For Teachers Only)

If you assigned a user the `'teacher'` role, you must also create a corresponding entry in the `teachers` table to link their profile.

1. Go to the **Table Editor** and select the `teachers` table.
2. Click **Insert Row**.
3. Paste the teacher user's UUID into the `user_id` field.
4. Fill in the teacher's `name`, `email`, and `subject` details.
5. Click **Save**.

---
## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute this software for educational and personal purposes.
