# 🎓 Uni Hub Docker Setup

A web application which provides university students a place to socialise, form study groups and stay informed with what's going on at their campus.

## 📋 Features

- ...

## 🛠️ Technology Stack

- **Frontend**
  - React 18
  - React Router for navigation
  - shadcn for components
  - Tailwind CSS for styling

- **Backend**
  - Django 5.1.6+
  - Django REST Framework

- **Database**
  - PostgreSQL

- **Authentication**
  - Django Sessions
  - Integration with Microsoft Login

- **Services**
  - Service developed using FastAPI with a pretrained BERT classifier to detect spam
  - Amazon S3 for file/media storage
  - Celery for asynchronous tasks

- **Docker**
  - Containerisation of the frontend, backend, celery, redis and the spam service

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v22+)
- Python (3.10+)
- PostgreSQL
- Git
- Docker

### Backend Setup (dev)

```bash
# Clone the repository
git clone https://github.com/wraithler/uni_hub.git
cd uni_hub

# Create and activate virtual environment
cd backend
python -m venv .venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements

# IMPORTANT: Add .env file (from Teams)

# Start dev environment in Docker
docker-compose -f .\docker-compose-dev.yml up --build

# Run migrations
docker exec -it backend python manage.py makemigrations
docker exec -it backend python manage.py migrate

# Create a superuser
docker exec -it backend python manage.py createsuperuser

# Load initial data
docker exec -it backend python manage.py loaddata initial_data
```

### Frontend Setup (dev)

```bash
# Navigate to frontend dir
cd frontend

# Install requirements
npm install
```
