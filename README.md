# Tritix Todo App

A full-stack Task Management Application built with Django, PostgreSQL, Django REST Framework, HTML, CSS, and JavaScript.

## Live Demo

https://tritix-todo-app.onrender.com

---

# Features

## Authentication
- User Registration
- User Login
- User Logout
- Protected Routes

## Task Management
- Create Tasks
- Update Tasks
- Delete Tasks
- Mark Tasks as Completed
- Clear Completed Tasks
- Task Priorities (Low, Medium, High)
- Due Dates
- Drag & Drop Task Reordering

## Categories
- Create Categories
- Assign Tasks to Categories
- Category Filtering

## Dashboard
- Search Tasks
- Filter by Status
- Filter by Category
- Filter by Priority
- Sort by Due Date
- Pagination
- Progress Tracking

## API
- Django REST Framework
- Paginated Task API
- Category API

## Deployment
- PostgreSQL Database
- Render Deployment
- WhiteNoise Static File Serving
- Gunicorn Production Server

---

# Project Architecture

```text
todo_app/
│
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── tasks/
│   ├── models.py
│   ├── views.py
│   ├── api_views.py
│   ├── serializers.py
│   ├── forms.py
│   ├── urls.py
│   ├── api_urls.py
│   └── admin.py
│
├── users/
│   ├── views.py
│   ├── forms.py
│   ├── urls.py
│   └── admin.py
│
├── templates/
│   ├── base.html
│   ├── registration/
│   │   └── login.html
│   ├── users/
│   │   └── register.html
│   └── tasks/
│       ├── dashboard.html
│       ├── task_form.html
│       └── task_confirm_delete.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── ui.js
│       ├── drag.js
│       └── storage.js
│
├── manage.py
├── requirements.txt
├── Procfile
└── README.md
```

---

# Tech Stack

## Backend
- Django
- Django REST Framework
- PostgreSQL
- Django Filter

## Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)

## Deployment
- Render
- Gunicorn
- WhiteNoise

---

# Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/selvakalusu003/tritix-todo-app.git
cd tritix-todo-app
```

## 2. Create Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python -m venv venv
source venv/bin/activate
```

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## 4. Create PostgreSQL Database

Create a PostgreSQL database and note:

- Database Name
- Database User
- Database Password
- Database Host
- Database Port

---

## 5. Configure Environment Variables

Create a `.env` file in the project root.

```env
SECRET_KEY=y=oozbq5zws#cgm!lu378w9#1lo*i@e1wl8_g=!m6d^m5b72hag

DEBUG=True

DATABASE_NAME=todo_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432

DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=Admin@123
```

---

## 6. Run Migrations

```bash
python manage.py migrate
```

---

## 7. Create Superuser

```bash
python manage.py createsuperuser
```

Or use the custom command:

```bash
python manage.py create_admin
```

---

## 8. Run Development Server

```bash
python manage.py runserver
```

Application:

```text
http://127.0.0.1:8000
```

Admin Panel:

```text
http://127.0.0.1:8000/admin
```

---

# Environment Variables

| Variable | Description |
|-----------|-------------|
| SECRET_KEY | Django Secret Key |
| DEBUG | Enable/Disable Debug Mode |
| DATABASE_NAME | PostgreSQL Database Name |
| DATABASE_USER | PostgreSQL Username |
| DATABASE_PASSWORD | PostgreSQL Password |
| DATABASE_HOST | PostgreSQL Host |
| DATABASE_PORT | PostgreSQL Port |
| DJANGO_SUPERUSER_USERNAME | Admin Username |
| DJANGO_SUPERUSER_EMAIL | Admin Email |
| DJANGO_SUPERUSER_PASSWORD | Admin Password |

---

# API Endpoints

## Tasks

```http
GET /api/tasks/
POST /api/tasks/
GET /api/tasks/<id>/
PUT /api/tasks/<id>/
DELETE /api/tasks/<id>/
```

## Categories

```http
GET /api/categories/
POST /api/categories/
```

---

# Deployment

The application is deployed on Render using:

- PostgreSQL Database
- Gunicorn
- WhiteNoise
- Environment Variables

Live URL:

https://tritix-todo-app.onrender.com/#

---

# Author

Selva Kalusalingam R