# MERN Admin/Employee Portals

Full stack MERN app with **two portals**:

- **Admin Portal**: login, approve employees, assign tasks, view all tasks/status
- **Employee Portal**: register, login after approval, view tasks, update status

## Tech

- MongoDB + Mongoose
- Express.js + Node.js
- React (Vite) + React Router
- Axios
- JWT auth + bcrypt password hashing

## Default Admin

- Email: `praneeth@gmail.com`
- Password: `praneeth123`

The backend auto-creates this admin on first start if it doesn’t exist.

## Project Structure

```
server/
  config/
  middleware/
  models/
  routes/
  server.js

client/
  src/
    components/
    pages/
    services/
    App.jsx
```

## Backend Setup

Create `server/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_portals
JWT_SECRET=replace_with_strong_secret
```

Run:

```bash
cd server
npm install
npm start
```

Dev mode (optional):

```bash
npm run dev
```

## Frontend Setup

Create `client/.env`:

```
VITE_API_BASE_URL=http://localhost:5000
```

Run:

```bash
cd client
npm install
npm start
```

Open the app at `http://localhost:5173`.

## API Routes

### Auth

- `POST /api/auth/register` (employee register; starts as not approved)
- `POST /api/auth/login` (admin/employee login; employee blocked until approved)

### Admin (JWT + admin role)

- `GET /api/admin/employees`
- `PUT /api/admin/approve/:id`
- `POST /api/admin/task`
- `GET /api/admin/tasks`

### Employee (JWT + employee role)

- `GET /api/employee/tasks/:employeeId`
- `PUT /api/employee/task/:taskId`

