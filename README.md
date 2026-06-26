# STIWK2124-A3-Group7

## Accessible Reading List (ARL) Management System

### Project Overview

The Accessible Reading List (ARL) Management System is a web-based application developed for the STIWK2124 Web Engineering course. The system allows users to manage book records through a modern Angular frontend integrated with a Spring Boot REST API backend and MySQL database.

The application supports essential CRUD (Create, Read, Update, Delete) operations, search functionality, pagination, and frontend-backend integration using RESTful APIs.

---

## Features

### Frontend (Angular)

* Responsive web interface
* Home page navigation
* Add new book records
* Edit existing book records
* Delete book records
* Search books by title
* View all books in a library table
* Pagination support
* Client-side form validation with inline error messages
* HTTP error & timeout handling with user-friendly messages
* Login page + Basic Auth (required for Add / Edit / Remove)

### Backend (Spring Boot)

* RESTful API implementation
* CRUD operations for book management
* MySQL database integration
* JPA Repository support
* Exception handling (handled 400 / 404 / 500 responses)
* CORS configuration for frontend communication
* **Spring Security – HTTP Basic Auth on write endpoints (POST/PUT/DELETE); GET stays public**
* Server-side input validation (Jakarta Bean Validation)

### Database

* MySQL database storage
* Automatic schema initialization
* Sample data population

---

## Technology Stack

| Technology      | Purpose                |
| --------------- | ---------------------- |
| Angular         | Frontend Development   |
| TypeScript      | Frontend Programming   |
| Spring Boot     | Backend Development    |
| Java 17         | Backend Programming    |
| MySQL           | Database Management    |
| Spring Data JPA | Database Access        |
| Maven           | Dependency Management  |
| Bootstrap       | User Interface Styling |

---

## Project Structure

```text
STIWK2124-A2-Group7
│
├── arlbackend/
│   ├── controller/
│   ├── model/
│   ├── repository/
│   ├── service/
│   └── resources/
│
├── arlfrontend/
│   ├── src/
│   ├── app/
│   └── assets/
│
└── README.md
```

---

# Setup Guide

## Prerequisites

Install the following software before running the project:

* Java JDK 17 or later
* Node.js and npm
* Angular CLI
* MySQL Server
* Git
* Visual Studio Code (Recommended)

Verify installation:

```bash
java -version
node -v
npm -v
ng version
```

---

## Clone Repository

```bash
git clone https://github.com/ddanialasy-cell/STIWK2124-A3-Group7.git
cd STIWK2124-A2-Group7
```

---

## Database Setup

1. Open MySQL.
2. Create a database:

```sql
CREATE DATABASE arl_db;
```

3. Configure database connection in:

```text
arlbackend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/arl_db
spring.datasource.username=root
spring.datasource.password=your_password
```

---

## Run Backend

Navigate to backend folder:

```bash
cd arlbackend
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

Backend server will start at:

```text
http://localhost:8080
```

Test API:

```text
http://localhost:8080/api/books
```

---

## Run Frontend

Open a new terminal:

```bash
cd arlfrontend
```

Install dependencies:

```bash
npm install
```

Start Angular application:

```bash
ng serve
```

Frontend will start at:

```text
http://localhost:4200
```

---

# Production Build

Build optimized, deployable artifacts without any extra tooling.

### Backend (executable JAR)

```bash
cd arlbackend
./mvnw clean package -DskipTests      # Windows: .\mvnw.cmd clean package -DskipTests
```

Output: `arlbackend/target/arlbackend-0.0.1-SNAPSHOT.jar`. Run it with:

```bash
java -jar target/arlbackend-0.0.1-SNAPSHOT.jar
```

(Requires a running MySQL and the credentials set in `application.properties`,
or pass them as environment variables, e.g. `SPRING_DATASOURCE_USERNAME`.)

### Frontend (static bundle)

```bash
cd arlfrontend
ng build
```

Output: `arlfrontend/dist/arlfrontend/browser/` — static files ready to serve
from any web server (the included `nginx.conf` shows a working configuration).

---

# Deployment (Docker)

> Optional — requires Docker Desktop. If Docker is not installed, use the
> **Production Build** above instead; the `Dockerfile`s and `docker-compose.yml`
> still document the containerized setup.

The whole stack (MySQL + backend + frontend) can be started with one command
using Docker. Requires **Docker Desktop**.

```bash
# From the project root (where docker-compose.yml lives)
docker compose up --build
```

This starts:

| Service  | URL                    | Notes                          |
| -------- | ---------------------- | ------------------------------ |
| Frontend | http://localhost:4200  | Angular app served by nginx    |
| Backend  | http://localhost:8080  | Spring Boot REST API           |
| MySQL    | localhost:3306         | database `arl_db` (auto-init)  |

Open **http://localhost:4200** and log in with `admin` / `admin123`.

To stop and remove the containers:

```bash
docker compose down          # keep data
docker compose down -v       # also wipe the MySQL volume
```

> Each service also has its own `Dockerfile` (`arlbackend/Dockerfile`,
> `arlfrontend/Dockerfile`) using multi-stage builds.

---

# Testing

### Backend (JUnit + Mockito + MockMvc)

```bash
cd arlbackend
./mvnw test          # or: mvn test
```

Tests run against an in-memory **H2** database (no MySQL needed):

* `BookServiceTest` – service logic with Mockito (success & failure paths).
* `BookControllerTest` – web layer with MockMvc, including Basic Auth rules
  (public GET, 401 without auth, 201 with auth, 400 validation, 404 not found).
* `ArlbackendApplicationTests` – context load smoke test.

**Code coverage** is generated automatically by **JaCoCo** when running the tests.
After `mvnw test`, open the report at:

```
arlbackend/target/site/jacoco/index.html
```

### Frontend (Vitest)

```bash
cd arlfrontend
ng test --watch=false
```

* `BookService` spec – verifies API calls, request bodies, and the friendly
  error mapping using `HttpTestingController`.

**Code coverage** (Istanbul / vitest):

```bash
ng test --watch=false --coverage
```

Report is written to `arlfrontend/coverage/arlfrontend/index.html`.

---

# Usage

## Authentication (Login)

Reading books (Home, Library, search, pagination) is **open to everyone**.
Adding, editing, or removing books requires logging in — these write endpoints
are protected by HTTP Basic Auth on the backend.

**Default credentials:**

```text
Username: admin
Password: admin123
```

Steps:

1. Click **Login** in the navbar.
2. Enter the credentials above.
3. After signing in, the Add / Edit / Remove pages become accessible, and the
   frontend automatically attaches the Basic Auth header to write requests.
4. Click **Logout** in the navbar to clear the session.

> If you try to open Add / Edit / Remove without logging in, you are redirected
> to the login page. Direct API write calls without credentials return **401 Unauthorized**.

---

## Home Page

The Home page provides navigation to the main modules:

* Book Management
* Library Management

---

## Library Module

The Library page allows users to:

* View all books
* Search books by title
* Browse books using pagination
* View detailed book information

Displayed information:

* Book ID
* Book Title
* Book Author
* Book Description
* Book Category

### Example Search

Input:

```text
Quantum
```

Result:

```text
The Quantum Paradox
Author: Elena Rostova
Category: Sci-Fi
```

---

## Add Book

Navigate to:

```text
Book → Add Book
```

Fill in:

* Book Title
* Book Author
* Book Description
* Book Category

Click **Submit** to save the record.

### Example

```text
Book Title: Clean Code
Book Author: Robert C. Martin
Book Description: Guide to writing maintainable software.
Book Category: Programming
```

---

## Edit Book

Navigate to:

```text
Book → Edit Book
```

Steps:

1. Enter Book ID.
2. Click Search.
3. Modify the book information.
4. Click Update.

### Example

```text
Book ID: 5

Old Title:
Beneath Neon Skies

New Title:
Beneath Neon Skies Revised
```

---

## Remove Book

Navigate to:

```text
Book → Remove Book
```

Steps:

1. Enter Book ID.
2. Click Search.
3. Verify book details.
4. Click Delete.

### Example

```text
Book ID: 10

Title:
Shadows of the Citadel
```

## Group Member

1. Muhammad Danial Asyraf Bin Azhar 304586 
2. Tan Jun Hao 305506 
3. Ng Ee Jing 305874 
4. Hazaruddin bin Mazlan 306120 
5. Justin Abraham Unggun anak Numpang 306087 
