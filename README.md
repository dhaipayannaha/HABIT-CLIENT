# Habit Tracker
This is a Habit Tracker Web Application where users can create, track, and manage their daily habits.

---

## 🚀 Tech Stack

This project is built using modern web technologies to ensure high performance, scalability, and an exceptional user experience.

| Category | Technology |
|-----------|------------|
| ⚛️ Frontend Framework | React 19 + TypeScript |
| ⚡ Build Tool | Vite 7 |
| 🎨 Styling | Tailwind CSS v4 + DaisyUI |
| 🧩 UI Components | Radix UI, Shadcn/UI, Lucide React |
| 🛣️ Routing | React Router v7 |
| 📡 Data Fetching & State Management | TanStack Query (React Query v5) |
| 🌐 HTTP Client | Axios |
| 📅 Date & Time Handling | date-fns, react-day-picker |
| 🔔 Alerts & Notifications | SweetAlert2 |


---

## ✨ Key Features

### 🎯 Habit Management
- Create habits with custom goals, categories, and frequencies (Daily, Weekly, Monthly)
- Select specific days for habit schedules
- Set duration targets from 1–365 days
- Edit and update habits anytime

### 📊 Progress Tracking
- Mark habits as completed with a single click
- Visual progress bar based on completed days
- Track successful and missed days
- Automatic expiry date calculation

### 📅 Interactive Habit Calendar
- 🟢 Completed Days
- 🟡 Scheduled Days
- 🔴 Missed Days

### 📜 Habit History
- View all habits in a clean table layout
- Track completion status, goals, duration, and creation dates
- Quick access to habit actions

### ♻️ Soft Delete & Restore
- Deleted habits are safely stored
- Restore habits anytime
- Permanent deletion option available

### 🛠️ Custom Business Logic Hooks
- `useCompleteHabit` – Complete habit tracking
- `useFailedHabit` – Failed habit management
- `useHabitCalendar` – Calendar visualization
- `useReconcileHabits` – Data synchronization
- `manageExpiry` – Expiry date handling
- `manageDays` – Progress & day tracking

### 🔥 User Experience
- Form validation with instant feedback
- Beautiful alerts using SweetAlert2
- Responsive and modern UI
- Fast and smooth performance

---

## Dependencies  
List required dependencies or major libraries:

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router": "^7.13.0",
    "@tanstack/react-query": "^5.90.21",
    "axios": "^1.13.6",
    "tailwindcss": "^4.1.18",
    "@tailwindcss/vite": "^4.1.18",
    "radix-ui": "^1.4.3",
    "lucide-react": "^0.564.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.4.0",
    "date-fns": "^4.1.0",
    "react-day-picker": "^9.14.0",
    "sweetalert2": "^11.26.18"
  },
  "devDependencies": {
    "vite": "^7.3.1",
    "@vitejs/plugin-react": "^5.1.1",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.48.0",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "shadcn": "^3.8.4",
    "daisyui": "^5.5.18",
    "tw-animate-css": "^1.4.0",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@types/node": "^24.10.1",
    "globals": "^16.5.0"
  }
}
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have installed:

- **Node.js** v18+
- **npm** v9+
- **Git**

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd HABIT-CLIENT-main

# Install dependencies
npm install
```

### Environment Setup (Optional)

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://habit-server-git-main-dhaipayannahas-projects.vercel.app
```

For local backend:

```env
VITE_API_URL=http://localhost:5000
```

### Run the Project

```bash
npm run dev
```

Open: `http://localhost:5173`

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

2. Set up environment variables by creating a `.env` file in the root directory:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

3. Run the application:

```bash
npm run dev
```

---

## 📁 Project Structure

```text
src/
├── Api/              # Axios-based API services and CRUD operations
├── components/
│   ├── sections/     # Page-level components
│   ├── HomePart/     # Home page sections and components
│   ├── HistoryPart/  # History page sections and components
│   └── UI/           # Reusable UI components
├── hooks/            # Custom React Hooks
├── layouts/          # Layout components (Navbar, Footer, RootLayout)
├── router/           # React Router configuration
├── types/            # TypeScript type definitions and interfaces
├── shared/           # Shared utilities and helper functions
└── lib/              # Common libraries and configurations
```

## Contact

**Backend URL:** (https://habit-server-git-main-dhaipayannahas-projects.vercel.app)
**Live URL:** [Live Site](https://glittery-faun-422aaa.netlify.app/)
**Email:** [username](dhaipayannaha@gmail.com)
**Portfolio:** [Portfolio]([https://yourportfolio.com](https://dhaipayan.netlify.app/))
