# Mind Archive 🌌

Mind Archive is a journaling web app built with Django and React. Users log meaningful life memories, visualized as stars in a night-sky-like constellation. Entries can be dragged and rearranged, making your memory space truly personal.

## ✨ Features
- **Add, edit, and delete memory entries**
- Stars representing memories are displayed on a canvas:
  - Positioned with randomized coordinates, draggable, and saved per user
  - Persisted across sessions
- **Memory entries support:**
  - Date
  - Description
  - Color (with personalized recent-color tracking per user)
  - Multiple optional image uploads
  - Favorite pinning
- **Constellation view:**
  - Entries are grouped and connected by month/year
  - Chronological linking within each group
- **Customizable experience:**
  - Dark/Light theme toggle
  - Timezone/region selection with live clock
- **User accounts:**
  - Google OAuth login
  - Memories shown only for the logged-in user

## 🚀 Setup Instructions

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/mindarchive.git
   cd mindarchive
   ```

2. Set up your virtual environment and install dependencies:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # or .venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

3. Run database migrations:
   ```bash
   python manage.py migrate
   ```

4. Start the backend development server:
   ```bash
   python manage.py runserver
   ```

5. Start the frontend development server:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🛠 Tech Stack
- **Backend:** Django + Django REST Framework  
  Uses `MultiPartParser`, `FormParser`, and `JSONParser` to support file uploads and PATCHing star positions
- **Frontend:** React  
  Stars rendered using absolute positioning and draggable with mouse  
  Dark mode, toast notifications, and OAuth integration

## 🔐 Authentication
- Google OAuth (via `django-allauth`) allows users to log in and access their personal journal

---

### 🌠 Created by Justin Asarias

