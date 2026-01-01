# Marathon Training App 🏃‍♂️

A modern, responsive web application for managing your **2Q Marathon Training Plan**.  
This app replaces the traditional CSV spreadsheet with an interactive dashboard while keeping your data portable.

## Features

- **📊 Visual Dashboard**: View your training weeks, workouts, and mileage targets in a clean, dark-mode UI.
- **📝 Editable Progress**: Log your actual mileage and workout notes directly in the app.
- **🔄 Auto-Sync**: Changes made in the app are automatically saved to `public/plan.csv`.
- **📱 Responsive**: Works great on desktop and mobile.
- **📂 CSV Backed**: Your data lives in a simple CSV file, making it easy to backup or edit manually if needed.

## getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Data Management

The app reads from and writes to `public/plan.csv`.
- The first 9 lines of the CSV are reserved headers.
- Data starts from line 10.
- You can replace this file with another compatible CSV plan at any time.

## Technology Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Data Parsing**: PapaParse
