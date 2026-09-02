# MediFlow

MediFlow is a comprehensive healthcare management platform that connects patients, doctors, and administrators through a unified, secure system.

## Architecture Overview

The system is built using a modern, decoupled architecture:
- **Backend**: A stateless REST API built with Java and Spring Boot. It utilizes Spring Security for strict role-based access control and JWT for authentication.
- **Frontend**: A responsive Single Page Application (SPA) built with React and Vite, using Axios for HTTP communication.
- **Database**: MySQL relational database managed via Spring Data JPA and Hibernate.

## Core Features

### Authentication & Authorization
- Secure JWT-based stateless authentication.
- BCrypt password hashing.
- Three distinct user roles: `PATIENT`, `DOCTOR`, and `ADMIN`.
- strict URL-level authorization rules.

### Patient Portal
- Registration and secure login.
- Search and filter available doctors and specialists.
- Book, view, and cancel appointments.

### Doctor Portal
- View assigned appointments.
- Approve, reject, and complete patient appointments.

### Admin Dashboard
- Centralized management of system entities.
- Manage patients, doctors, and system-wide appointments.

## Tech Stack

**Backend:**
- Java 25
- Spring Boot 4.x
- Spring Security (JWT)
- Spring Data JPA (Hibernate)
- MySQL
- Maven

**Frontend:**
- React (Vite)
- Standard CSS
- React Router DOM

## Local Setup

### Prerequisites
- Java 25
- Node.js 18+
- MySQL Server

### Database Configuration
Ensure a MySQL instance is running and create the `mediflow` database.
Configure your environment variables before running the backend:
```bash
export DB_URL=jdbc:mysql://localhost:3306/mediflow
export DB_USERNAME=root
export DB_PASSWORD=your_password
export JWT_PRIVATE_KEY=your_private_key
export JWT_PUBLIC_KEY=your_public_key
```

### Running the Backend
From the root directory:
```bash
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```
The API will be available at `http://localhost:8080`.

### Running the Frontend
```bash
cd mediflow-frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173` and will automatically proxy API requests to `localhost:8080`.

## Production Deployment (AWS EC2)

The application is configured for deployment on an Ubuntu-based AWS EC2 instance.

1. **Backend**: Managed as a `systemd` service running on internal port 8080.
2. **Frontend**: Built statically (`npm run build`) and served via Nginx.
3. **Nginx Reverse Proxy**: Nginx routes `/api/` traffic to the internal Spring Boot service, ensuring a single domain handles both static assets and API requests seamlessly.
