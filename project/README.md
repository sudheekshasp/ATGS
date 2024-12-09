# Timetable Generator

A comprehensive timetable generation system with authentication, template management, and course scheduling.

## Features

- User authentication (Admin/Faculty roles)
- Template management with preset and custom templates
- Faculty management with free slot selection
- Course scheduling with faculty assignment
- Interactive timetable editing
- Persistent storage

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

## Project Structure

- `/src/components/Auth` - Authentication components
- `/src/components/Dashboard` - Main dashboard components
- `/src/store` - State management using Zustand
- `/src/types` - TypeScript type definitions

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand for state management
- Lucide React for icons