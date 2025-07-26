# TreadValue Pro - ROI Calculator Platform

## Overview

TreadValue Pro is a SaaS platform designed for the tire retreading industry that generates intelligent commercial proposals and ROI calculations. The application helps retreading companies convert skeptical clients by providing data-driven arguments, optimize operations through analytics, and demonstrate environmental value through official reports.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack TypeScript architecture with a clear separation between client and server components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Validation**: Zod schemas shared between client and server
- **Session Management**: Express sessions with PostgreSQL store

## Key Components

### Database Schema
The application uses three main database tables:
- **Companies**: Store client company information (name, contact details, address)
- **Proposals**: Store ROI calculations and proposal data (fleet size, vehicle type, calculated savings, status)
- **Calculations**: Store detailed calculation breakdowns and environmental impact data

### ROI Calculation Engine
A sophisticated calculation engine that processes:
- Fleet size and annual kilometers
- Vehicle type (heavy truck, medium truck, light utility, bus)
- Fuel prices and regional factors
- Multi-year savings projections
- Environmental impact (CO2 reduction)
- Cost per kilometer analysis
- Payback period calculations

### UI Components
- **Dashboard**: Main interface showing key metrics and recent activity
- **ROI Calculator**: Interactive form for generating calculations with real-time results
- **Proposal Management**: Tools for creating, tracking, and managing client proposals
- **Statistics Cards**: Key performance indicators and metrics visualization
- **Navigation**: Responsive navigation with user profile management

## Data Flow

1. **User Input**: Client details and fleet parameters entered through forms
2. **Calculation Processing**: Server-side ROI engine processes input data
3. **Results Generation**: Calculated savings, environmental impact, and ROI metrics
4. **Proposal Creation**: Results formatted into professional proposals
5. **Data Persistence**: All calculations and proposals stored in PostgreSQL
6. **Dashboard Updates**: Real-time statistics and activity tracking

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

The application is designed for deployment on Replit with the following configuration:

### Development Environment
- **Dev Server**: `npm run dev` starts both Vite frontend and Express backend
- **Database**: Neon serverless PostgreSQL with connection pooling
- **Hot Reload**: Vite HMR for frontend, tsx watch mode for backend

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Environment**: NODE_ENV=production with optimized settings
- **Database Migrations**: Drizzle Kit handles schema migrations

### Key Architectural Decisions

1. **Monorepo Structure**: Client, server, and shared code in a single repository for easier development and deployment
2. **Shared Schema**: Zod schemas in `/shared` directory ensure type safety between frontend and backend
3. **Memory Storage Fallback**: In-memory storage implementation for development/testing when database is unavailable
4. **Type Safety**: Full TypeScript coverage from database to UI components
5. **Component Architecture**: Modular UI components with consistent design system
6. **Serverless Database**: Neon PostgreSQL for scalable, managed database hosting

The architecture prioritizes developer experience, type safety, and scalability while maintaining simplicity for rapid iteration and deployment.