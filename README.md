# Hospital Administration and Management System (HAMS)

A comprehensive web-based hospital management application built with React, Next.js, and TypeScript.

## Features

### 🏥 Multi-Role Support
- **Patients**: Book appointments, view health records, manage prescriptions
- **Doctors**: Manage schedules, view patient information, write prescriptions
- **Staff**: Enter test results, manage medical equipment
- **Administrators**: User management, generate reports, system oversight

### 📱 Key Functionalities
- **Appointment Management**: Book, reschedule, and cancel appointments
- **Health Records**: Digital health cards with test results and prescriptions
- **Schedule Management**: Doctor availability and time slot management
- **Resource Tracking**: Medical equipment and inventory management
- **Reporting**: Statistical reports for administrators

## Tech Stack

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React
- **Database**: PostgreSQL (backend integration ready)
- **Backend**: Django REST API (separate repository)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/hospital-management-system.git
cd hospital-management-system
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up shadcn/ui components:
\`\`\`bash
npx shadcn@latest init
npx shadcn@latest add button card input label select tabs dropdown-menu badge table
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
hospital-management-system/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Login/Register page
│   └── dashboard/               # Dashboard routes
│       ├── patient/             # Patient dashboard
│       ├── doctor/              # Doctor dashboard
│       ├── admin/               # Admin dashboard
│       └── staff/               # Staff dashboard
├── components/                   # Reusable components
│   └── ui/                      # shadcn/ui components
├── lib/                         # Utility functions
├── public/                      # Static assets
└── styles/                      # Global styles
\`\`\`

## User Roles & Access

### Patient Dashboard
- View and book appointments
- Access health records and test results
- Manage prescriptions
- Provide feedback on appointments

### Doctor Dashboard  
- Manage daily schedule and availability
- View patient appointments and history
- Write prescriptions and enter diagnoses
- Access medical equipment inventory

### Staff Dashboard
- Enter blood test results
- Manage medical equipment
- Update patient health records

### Admin Dashboard
- User management (create, edit, delete users)
- Generate statistical reports
- Monitor system usage and performance
- Manage departments and resources

## Database Schema

The application is designed to work with the following key entities:
- Users (patients, doctors, staff, admins)
- Appointments
- Health Cards & Medical Records
- Prescriptions & Medications
- Blood Tests & Results
- Medical Equipment
- Departments & Schedules

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Team

- **Deniz Şahin** - 22201690
- **Furkan Mert Aksakal** - 22003191  
- **Isa Ahmad Khan** - 22101309
- **Mehmet Eren Anbar** - 22002600
- **Furkan Özer** - 22203555

## License

This project is part of CS353 Database Systems course.

## Screenshots

### Login Page
![Login](public/screenshots/login.png)

### Patient Dashboard
![Patient Dashboard](public/screenshots/patient-dashboard.png)

### Doctor Schedule
![Doctor Schedule](public/screenshots/doctor-schedule.png)

### Health Card
![Health Card](public/screenshots/health-card.png)
