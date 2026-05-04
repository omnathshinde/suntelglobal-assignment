# Suntel Global Assigment

## **Database Setup**

- Create the PostgreSQL database:

```sql
CREATE DATABASE bookstore;
```

---

## **Backend Setup**

- Navigate to the `server` folder:

```bash
cd server
```

- Create a `.env` file and add the following environment variables:

```env
NODE_ENV=production

HOST=localhost
PORT=3000
HTTPS=false

DB_NAME=bookstore
DB_USER=username
DB_PASS=password
DB_HOST=localhost
DB_DIALECT=mysql
```

- Install dependencies and start the server:

```bash
npm ci
npm run dev
```

## **Frontend Setup**

- Navigate to the `client` folder:

```bash
cd client
```

- Install dependencies and start the frontend:

```bash
npm ci
npm run dev
```

---
