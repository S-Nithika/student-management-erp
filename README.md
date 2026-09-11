# EduTrack Matrix ERP — Student Lifecycle & Analytics Platform

An institutional-grade student management dashboard that handles student registration, semester-wise marks entry, and merit-based ranking — all in a single, sleek admin interface.

## 🚀 Overview

**EduTrack Matrix ERP** is a front-end student lifecycle management system designed to simulate an institutional ERP module. It allows an admin to register students, manage their records, track marks across 8 semesters, and view a merit toppers board — all backed by browser-based storage for persistence.

## ✨ Features

- **Student Registry:** Add, edit, delete, and search student profiles (Name, Roll Number, College Email, Department)
- **Dynamic Search:** Real-time profile search by name/roll number
- **1–8 Semester Marks Entry:** Record and manage marks across all semesters
- **Merit Toppers Board:** Auto-ranked leaderboard based on academic performance
- **Light/Dark Mode Toggle**
- **Data Persistence:** All records saved locally using LocalStorage (no backend required)
- **Sync Status Indicator** for data save confirmation
- Clean, dashboard-style responsive UI

## 🛠️ Tech Stack

- **Languages:** HTML5, CSS3, JavaScript (Vanilla JS)
- **Data Storage:** Browser LocalStorage (client-side persistence, no backend)
- **Version Control:** Git & GitHub
- **Editor:** VS Code

## 📂 Project Structure

```
edutrack-matrix-erp/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js        # CRUD logic, LocalStorage handling, search & ranking
├── assets/
└── README.md
```

## ⚙️ Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/<your-username>/edutrack-matrix-erp.git
   cd edutrack-matrix-erp
   ```
2. Open `index.html` directly in your browser, or run a local server:
   ```bash
   npx live-server
   ```

