# MarketVue - Real-time Stock Market Dashboard

## Overview

MarketVue is a modern, real-time stock market analysis platform built as a full-stack web application. The application provides live stock data visualization, DJIA (Dow Jones Industrial Average) tracking, market news aggregation, and advanced analytics for informed trading decisions. It features a responsive design with both light and dark themes, interactive charts, and comprehensive market data display.

The platform is designed for traders, investors, and financial analysts who need real-time market intelligence with professional-grade visualization tools. The application emphasizes user experience with intuitive navigation, real-time data updates, and mobile-responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built as a Single Page Application (SPA) using React 18 with TypeScript. The architecture follows a component-based design pattern with:

- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for fast development and optimized production builds

The frontend implements a clean separation of concerns with dedicated directories for pages, components, hooks, and utilities. Custom hooks manage theme switching and mobile responsiveness.

### Backend Architecture
The server follows a RESTful API design built on Express.js with TypeScript:

- **Framework**: Express.js with middleware for JSON parsing, CORS handling, and request logging
- **Storage Layer**: Abstracted storage interface supporting both in-memory and database implementations
- **API Design**: Resource-based endpoints for stocks, price history, and market news
- **Development Setup**: Vite integration for hot module replacement during development
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

The backend uses a modular route registration system and implements comprehensive logging for API requests with performance metrics.

### Data Storage Solutions
The application uses a flexible storage architecture with multiple options:

- **Development**: In-memory storage implementation for rapid prototyping
- **Production**: Drizzle ORM with PostgreSQL support via Neon Database
- **Schema Management**: Drizzle Kit for database migrations and schema evolution
- **Connection Management**: @neondatabase/serverless for serverless PostgreSQL connections

The database schema includes tables for users, stock data, price history, and market news with proper relationships and indexing strategies.

### Authentication and Authorization
The current implementation includes user schema preparation but authentication is not yet fully implemented. The system is designed to support:

- **User Management**: User registration and login functionality
- **Session Handling**: Prepared for session-based authentication
- **Security**: Password hashing and secure session management (to be implemented)

### External Service Integrations
The application is structured to integrate with external financial data providers:

- **Stock Data APIs**: Endpoints prepared for real-time stock price feeds
- **News APIs**: Market news aggregation from financial news sources
- **Rate Limiting**: Built-in request throttling for external API calls
- **Error Resilience**: Fallback mechanisms for external service failures

### UI Component System
The frontend uses a comprehensive design system built on shadcn/ui:

- **Base Components**: Radix UI primitives for accessibility and behavior
- **Custom Components**: Business-specific components for stock data visualization
- **Theming**: CSS custom properties system supporting light/dark modes
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Animation**: Smooth transitions and loading states throughout the interface

The component architecture emphasizes reusability, accessibility, and consistent visual design across all application features.

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with concurrent features
- **Express.js**: Backend web application framework
- **TypeScript**: Type safety across the entire application stack
- **Vite**: Build tool and development server with fast HMR

### Database and ORM
- **Drizzle ORM**: Type-safe ORM for database operations
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **Drizzle Kit**: Database schema management and migrations

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components for accessibility
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library for consistent iconography

### Data Visualization
- **Chart.js**: Canvas-based charting library for stock price visualization
- **React Chart.js 2**: React wrapper for Chart.js integration

### State Management and API
- **TanStack React Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing
- **Zod**: Runtime type validation and schema parsing

### Development and Build Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **PostCSS**: CSS processing with Tailwind integration
- **ESBuild**: Fast JavaScript bundler for production builds

### Session and Security
- **connect-pg-simple**: PostgreSQL session store (prepared for implementation)
- **crypto**: Node.js cryptographic functionality for secure operations

The application is designed to be deployed on platforms like Replit, Vercel, or similar services with minimal configuration changes.