# 🎓 Uni Hub Docker Setup

## 📋 Setup Instructions

Follow these steps to set up and run the Uni Hub project using Docker:

---

### 1️⃣ **Download .env File from Teams**
Download the `.env` file from the Teams channel and place it in the root directory of the project. Ensure it is named `.env` and not `env`.

---

### 2️⃣ **Build and Start Docker Containers**
Use Docker Compose to build and start all necessary containers. Run the following command in your terminal:

```bash
docker-compose up --build
```

---

### 3️⃣ **Apply Database Migrations**
If database migrations are required, execute the following commands:

```bash
docker exec -it uni_hub-backend-1 python manage.py makemigrations
docker exec -it uni_hub-backend-1 python manage.py migrate
```

---

### Notes:

- Make sure Docker is installed and running properly on your system.
- The frontend server will be running on `http://localhost:3000`.
- The backend server will be running on `http://localhost:3001`.
- You can access the API at `http://localhost:3001/api/docs/#/`.

--- 

### Unit Testing
Use the following command to run the unit tests:

```bash
docker exec -it uni_hub-backend-1 python manage.py test
```