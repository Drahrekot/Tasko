# Project Overview

## Overview

This is a full-stack task management application built with a modern TypeScript stack. The application provides a clean, iOS-inspired interface for creating, updating, and managing tasks. It features a React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Library**: shadcn/ui components based on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation resolvers
- **Build Tool**: Vite with custom configuration for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript using tsx for development
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database Provider**: Neon Database serverless PostgreSQL
- **Session Management**: connect-pg-simple for PostgreSQL-backed session storage
- **Build Process**: esbuild for production bundling with ESM format

### Data Layer
- **Database**: PostgreSQL with Drizzle ORM schema definitions
- **Schema**: Type-safe database schema using Drizzle with Zod validation
- **Migrations**: Drizzle-kit for database schema migrations and management
- **Storage Abstraction**: Interface-based storage layer with in-memory fallback for development

### API Design
- **Pattern**: RESTful API with consistent error handling and logging
- **Endpoints**: CRUD operations for tasks (/api/tasks)
- **Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Logging**: Request/response logging with performance metrics

### Development Experience
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Hot Reload**: Vite HMR for frontend and tsx watch mode for backend
- **Path Aliases**: Configured import aliases for clean imports (@/, @shared/, etc.)
- **Code Quality**: ESLint and TypeScript strict mode for code consistency

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL database hosting
- **Environment Variables**: DATABASE_URL for database connection

### UI & Styling
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom theming
- **Lucide React**: Consistent icon library for UI elements
- **class-variance-authority**: Type-safe variant API for component styling

### Development Tools
- **Replit Integration**: Vite plugins for Replit-specific development features
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional class name handling
- **nanoid**: Unique ID generation for development storage
- **Zod**: Runtime type validation and schema definition