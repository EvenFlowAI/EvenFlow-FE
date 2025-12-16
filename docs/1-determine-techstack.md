# EvenFlow-FE Tech Stack Analysis

## Core Technology Stack

### Programming Language

- **TypeScript 4.9.5** - Strongly typed language for safety and maintainability
- **React 18.2.0** - Core UI framework

### Primary Framework

- **React** with TypeScript (React.FC components)
- **React Router DOM 5.2.0** - Client-side routing and navigation

### State Management

- **Redux Toolkit 1.4.0** - Modern Redux setup with minimal boilerplate
- **Redux Core 4.0.5** - State container
- **Redux Persist 6.0.0** - Persists Redux store to local storage
- **Redux Thunk 2.3.0** - Middleware for async actions and complex side effects
- **React-Redux 9.1.0** - React bindings for Redux

### UI Component Library

- **Material-UI (MUI) 5.15.4** - Comprehensive React component library
  - `@mui/material` - Core components
  - `@mui/icons-material` - Icon set
  - `@mui/lab` - Lab components (experimental)
  - `@mui/styles` - Styling system
  - `@mui/x-date-pickers` - Date/time picking components
- **Emotion (@emotion/react, @emotion/styled)** - CSS-in-JS styling library (MUI's styling engine)
- **TSS-React 4.9.3** - TypeScript-first styling solution with MUI integration
- **Notistack 3.0.1** - Snackbar/notification component library

### Data & API

- **Axios 0.19.2** - HTTP client for API requests
- **Query String 8.1.0** - Parse and stringify URL query strings
- **Draft-JS 0.11.7** - Rich text editor library
- **Draft-Convert 2.1.13** - HTML/markdown conversion for Draft-JS
- **Slate 0.82.1** & **Slate-React 0.82.2** - Rich text editing framework (alternative to Draft-JS)
- **React-Draft-WYSIWYG 1.15.0** - WYSIWYG editor component

### Drag & Drop

- **React-DND 16.0.1** - React bindings for drag and drop
- **React-DND-HTML5-Backend 16.0.1** - HTML5 drag and drop backend
- **@hello-pangea/dnd 18.0.1** - Drag and drop library

### Date & Time

- **Dayjs 1.11.10** - Lightweight date library
- **Moment.js 2.27.0** - Date manipulation library
- **@date-io/moment 1.x** - Moment adapter for MUI date picker

### Internationalization (i18n)

- **i18next 21.9.1** - Internationalization framework
- **React-i18next 11.18.5** - React binding for i18next
- **i18next-browser-languagedetector 6.1.5** - Automatically detect browser language

### Google Integration

- **React-Google-Autocomplete 2.6.1** - Google autocomplete for React
- **React-Google-Places-Autocomplete 3.3.4** - Google Places autocomplete component

### Utilities

- **UUID 8.3.0** - Generate unique identifiers
- **URL-Safe-Base64 1.1.1** - URL-safe base64 encoding/decoding
- **Clsx 1.1.1** - Conditional className utility
- **React-Click-Away-Listener 2.2.3** - Detect clicks outside components
- **React-Device-Detect 2.2.3** - Detect device/browser information
- **React-Virtualized-Auto-Sizer 1.0.3** - Virtual scrolling utility
- **React-Window 1.8.6** - Efficient list rendering (virtualization)
- **React-Phone-Number-Input 3.2.12** - International phone number input
- **React-Error-Boundary 4.1.2** - Error boundary component for React

### Analytics & Monitoring

- **React-GA 3.3.0** - Google Analytics integration
- **React-GA4 1.4.1** - Google Analytics 4 integration
- **React-GTM-Module 2.0.11** - Google Tag Manager integration
- **Sentry (@sentry/react 8.26.0)** - Error tracking and monitoring
- **AWS RUM (aws-rum-web 1.19.0)** - Real User Monitoring for AWS

### Build & Development Tools

- **React-Scripts 5.0.1** - Create React App build scripts (CRA-based)
- **TypeScript 4.9.5** - TypeScript compiler and type definitions
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit linting and formatting
- **Fork-TS-Checker-Webpack-Plugin 9.0.2** - TypeScript type checking in webpack

### Testing

- **@testing-library/jest-dom** - DOM testing utilities
- **@types/jest** - Jest type definitions
- **react-scripts test** - Jest test runner via CRA

---

## Domain Specificity Analysis

### Application Purpose

**EvenFlow-FE** is a comprehensive **automotive dealership appointment and capacity management platform** with a focus on:

- Service booking and appointment scheduling
- Dealership operations and resource management
- Employee capacity optimization
- Customer transportation coordination
- Multi-location dealership network management

### Core Business Concepts

1. **Appointments & Booking Flow**
   - Service appointments with customers
   - Appointment tracking and cancellation
   - Service selection workflow
   - Transportation options management
   - Booking flow configuration

2. **Dealership Operations**
   - Multiple dealership locations (service centers)
   - Employee management and scheduling
   - Facility capacity management
   - Service consultant allocation
   - Pod (service area) management

3. **Capacity Management**
   - Slot scoring and availability
   - Optimization windows
   - Employee capacity tracking
   - Service valet/mobile service capacity
   - Demand management

4. **Services & Pricing**
   - Service type categorization
   - Service request management
   - Value settings and pricing
   - Complementary services
   - Package management

5. **Customer Management**
   - Vehicle details tracking
   - Enhanced customer search
   - Customer recall notifications
   - Transportation needs coordination

6. **Admin & Configuration**
   - Admin panel for system administration
   - General settings and configuration
   - Screen-specific settings
   - Holiday management
   - User roles and permissions

### Data Types & Structures

- **Appointments** - Core booking entities with status, time, consultant, vehicle info
- **Service Centers** - Multi-location dealership data
- **Employees** - Staff with roles, schedules, capacity constraints
- **Service Requests** - Customer service needs and history
- **Schedules** - Time periods with availability/constraints
- **Slots** - Time slots with scoring and availability
- **Vehicles** - Customer vehicle records with service history
- **Users** - System users with roles and permissions

### User Interactions

- Booking workflow (select service, date/time, transportation, etc.)
- Admin dashboard for managing appointments and capacity
- Real-time slot availability viewing
- Email-based appointment links (anonymous user support)
- Multi-language support (internationalization)
- Mobile-responsive design

### User Roles

- **Customers** - Book appointments via public/email links
- **Service Consultants** - Manage appointments at service centers
- **Service Center Managers** - Manage facility capacity and staff
- **Dealership Admins** - Configure system settings and manage locations
- **EvenFlow Admins** - System-wide administration

---

## Application Boundaries & Architecture Constraints

### Core Features (In Scope)

✅ Service appointment booking and management
✅ Multi-location dealership support
✅ Employee and capacity scheduling
✅ Real-time slot availability and scoring
✅ Customer management and vehicle tracking
✅ Admin configuration and settings
✅ Email-based appointment links
✅ Mobile-responsive UI
✅ Multi-language support
✅ Drag-and-drop scheduling interfaces
✅ Real User Monitoring and analytics

### Architectural Patterns

- **Redux-based state management** - All business logic flows through Redux actions/reducers
- **Modular component structure** - Components organized by feature/domain
- **Custom hooks for logic extraction** - Business logic isolated in custom hooks
- **TypeScript throughout** - Strong typing enforced at compilation
- **MUI-based UI** - Consistent Material Design components
- **API abstraction layer** - Centralized axios-based API client
- **Route-based code splitting** - Different sections (booking, admin, login) as separate routes
- **Persistent state** - Redux Persist maintains auth and preferences

### Architectural Inconsistencies to Avoid

❌ Direct API calls outside the centralized `api.ts` module
❌ Global state without Redux (use custom hooks with Redux only)
❌ UI components using hardcoded English strings (always use i18n)
❌ Custom styling outside MUI/Emotion/TSS patterns
❌ Components without TypeScript types
❌ Direct DOM manipulation (use React refs only when necessary)
❌ Business logic in component render methods
❌ Uncontrolled form inputs (always bind to state)

---

## Summary

**EvenFlow-FE** is a modern, TypeScript-based React SPA built for automotive dealership operations. It emphasizes:

- Strong typing and compile-time safety
- Redux-based predictable state management
- Material Design consistency via MUI
- Internationalization support for global markets
- Real-time monitoring and analytics
- Responsive, accessible UI components
- Modular, feature-driven architecture
