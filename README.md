# Mind Archive 🌌

Mind Archive is a journaling web app built with Django and React. Users log meaningful life memories, visualized as stars in a night-sky-like constellation. Entries can be dragged and rearranged, making your memory space truly personal.

## ✨ Features
- Add and view memory entries on a timeline-based star map
- Drag stars to reposition them — saved persistently across sessions
- Entries include:
  - Date
  - Description
  - Color
  - Optional image
- Chronological constellations connect entries by month
- Light/Dark mode toggle
- Django Admin panel for backend management
- Google OAuth login (session-based auth)

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

4. Start the development server:
   ```bash
   python manage.py runserver
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

