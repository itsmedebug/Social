# Pragyan Chakra - Ocean Safety Network

## Overview

Pragyan Chakra is a citizen-driven ocean hazard reporting platform designed to empower coastal communities through real-time safety information sharing. The application combines social media-style feeds, interactive mapping, and community-driven reporting to create a comprehensive ocean safety network. Users can submit hazard reports with media uploads, view reports on an interactive map, and engage with a social feed that aggregates ocean-related content from various platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses React with TypeScript as the primary frontend framework, built with Vite for optimal development experience. The UI is styled with Tailwind CSS and uses shadcn/ui components for a consistent design system. The frontend follows a single-page application pattern with client-side routing handled by Wouter.

**Key Frontend Decisions:**
- **React + TypeScript**: Chosen for type safety and component-based architecture
- **Tailwind CSS**: Provides utility-first styling with a comprehensive design system
- **shadcn/ui**: Offers accessible, pre-built components with consistent styling
- **Vite**: Selected for fast development builds and hot module replacement

### Backend Architecture
The backend is built with Express.js and follows a RESTful API pattern. The server includes middleware for request logging, error handling, and serves static files in production. The architecture supports both development and production environments with appropriate tooling.

**Key Backend Decisions:**
- **Express.js**: Lightweight and flexible Node.js framework for API development
- **In-memory storage**: Currently uses a memory-based storage system with sample data for prototyping
- **RESTful endpoints**: Provides clear API structure for hazard reports and social posts
- **Middleware pattern**: Implements logging, error handling, and request processing

### Data Storage
The application is configured to use PostgreSQL with Drizzle ORM for database operations. The schema includes tables for users, hazard reports, and social posts with proper relationships and constraints. Currently operates with in-memory storage for development but ready for database integration.

**Storage Schema Design:**
- **Users table**: Manages user profiles with verification status and community points
- **Hazard reports table**: Stores incident reports with geolocation, media, and risk levels
- **Social posts table**: Aggregates social media content with sentiment analysis
- **Drizzle ORM**: Provides type-safe database queries and migrations

### State Management
The application uses TanStack Query (React Query) for server state management, providing caching, background updates, and optimistic updates. Local component state is managed with React hooks, while global state is minimal and handled through React Context where needed.

**State Management Choices:**
- **TanStack Query**: Handles server state with intelligent caching and synchronization
- **React hooks**: Manages local component state and side effects
- **Context API**: Used sparingly for global state like mobile navigation

### Media Handling
The application supports image and video uploads for hazard reports. Media files are handled through browser File API with preview capabilities. The system includes geolocation services for automatic location tagging of reports.

**Media Architecture:**
- **File uploads**: Supports image and video files with preview functionality
- **Geolocation API**: Automatically captures location data for reports
- **Media preview**: Real-time preview of uploaded content before submission

### Responsive Design
The application implements a mobile-first responsive design with dedicated mobile navigation patterns. The layout adapts from a sidebar navigation on desktop to a collapsible mobile menu on smaller screens.

**Responsive Strategy:**
- **Mobile-first**: Designed for mobile devices with desktop enhancements
- **Adaptive navigation**: Sidebar on desktop, collapsible menu on mobile
- **Flexible grid layouts**: Uses CSS Grid and Flexbox for responsive components

## External Dependencies

### Database and ORM
- **PostgreSQL**: Primary database for persistent storage (via Neon Database serverless)
- **Drizzle ORM**: Type-safe database toolkit with schema migrations
- **Drizzle Kit**: Command-line tool for database schema management

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Accessible component primitives for complex UI patterns
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide React**: Icon library for consistent iconography

### Maps and Geolocation
- **Leaflet.js**: Interactive mapping library loaded dynamically
- **OpenStreetMap**: Tile provider for map data
- **Browser Geolocation API**: Native geolocation services

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and enhanced developer experience
- **Replit plugins**: Development environment integrations for error handling and debugging

### API and Data Fetching
- **TanStack Query**: Server state management and data fetching
- **Fetch API**: Native HTTP client for API requests

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **Express sessions**: Server-side session management