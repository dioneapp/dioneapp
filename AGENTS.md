# AGENTS.md - Dione Project Guidelines

This file contains guidelines for agentic coding agents working on the Dione Electron application.

## Project Overview

Dione is an Electron-based desktop application for app installation and management. The project uses React with TypeScript, Tailwind CSS, and an Express.js backend with Supabase integration.

## Build & Development Commands

### Core Commands
```bash
npm dev              # Start development server with --noSandbox
npm build            # Type check and build for production
npm start            # Run electron-vite preview
```

### Platform-Specific Builds
```bash
npm build:win        # Build for Windows
npm build:mac        # Build for macOS  
npm build:linux      # Build for Linux
npm build:unpack     # Build without packaging
```

### Code Quality
```bash
npm format           # Format code with Biome
npm typecheck        # Type check both node and web
npm typecheck:node   # Type check main process only
npm typecheck:web    # Type check renderer process only
```

### Testing
Currently no test framework is configured. When adding tests, check for existing test setup or consult with the user.

### Utilities
```bash
npm generate-translations  # Generate translations using Gemini API
npm generate-icons         # Generate app icons
npm deploy                 # Build and publish with auto-changelog
```

## Code Style Guidelines

### Formatting (Biome)
- **Indentation**: Tabs (configured in biome.json)
- **Quotes**: Double quotes for JavaScript/TypeScript
- **Line Endings**: LF
- **Trim Trailing Whitespace**: Enabled

### Import Patterns
- **Path Aliases**: Use `@/` for main process, `@/` and `@assets/*` for renderer
- **Node Modules**: Use `node:` prefix for built-in modules (`import fs from "node:fs"`)
- **Absolute Imports**: Preferred over relative imports
- **Type Imports**: Use TypeScript type imports where appropriate

### Naming Conventions
- **Files**: kebab-case for utilities, PascalCase for components
- **Variables/Functions**: camelCase with descriptive names
- **Constants**: UPPER_SNAKE_CASE for environment variables
- **Types/Interfaces**: PascalCase with descriptive names
- **Components**: PascalCase, file names should match component names

### TypeScript Guidelines
- Strict mode enabled
- `any` types are allowed (`noExplicitAny: "off"`)
- Use proper type definitions for all function parameters and return values
- Leverage the existing path alias configuration

### React Guidelines
- Use functional components with hooks
- Array index keys are allowed (`noArrayIndexKey: "off"`)
- Exhaustive dependencies rule is disabled (`useExhaustiveDependencies: "off"`)
- Follow the existing component structure in `src/renderer/src/components/`

### Error Handling
- **Main Process**: Use Winston logger with structured logging
- **Frontend**: Implement error boundaries and proper error hooks
- **API Calls**: Use try-catch blocks with proper error propagation
- **Async Operations**: Use Promise.race with timeout handling
- **User Feedback**: Dialog boxes for critical errors, toast notifications for warnings

## Project Structure

```
src/
├── main/                    # Electron main process
│   ├── index.ts            # Main entry point
│   ├── config.ts           # App configuration management
│   ├── server/             # Express backend server
│   ├── utils/              # Main process utilities
│   ├── security/           # Security token management
│   └── discord/            # Discord RPC integration
├── renderer/               # React frontend
│   ├── src/
│   │   ├── App.tsx         # Main app component
│   │   ├── components/     # React components
│   │   ├── pages/          # Route pages
│   │   ├── utils/          # Frontend utilities
│   │   ├── translations/   # i18n translations
│   │   └── assets/         # Static assets
│   └── index.html          # HTML template
└── preload/                # Electron preload scripts
    └── index.ts            # Preload API exposure
```

## Key Patterns & Conventions

### Component Organization
- Feature-based organization in `src/renderer/src/components/features/`
- Reusable UI components in `src/renderer/src/components/ui/`
- Each component should have its own file with matching name

### State Management
- Use React Context API for global state
- Local state with useState and useReducer hooks
- Follow existing context patterns in the codebase

### API Integration
- Express.js server in `src/main/server/`
- RESTful routes with proper HTTP methods
- Socket.io for real-time communication
- Supabase integration for database operations

### Security
- Token management in main process only
- Context isolation enabled in Electron webPreferences
- Proper CORS configuration for localhost
- Environment variables with ELECTRON_ prefix

### Styling
- Tailwind CSS with custom theme variables
- Follow existing utility class patterns
- Responsive design with mobile-first approach
- Use the existing color scheme and spacing system

## Development Workflow

1. **Before Making Changes**: Run `npm typecheck` to ensure code compiles
2. **During Development**: Use `npm dev` for hot reloading
3. **Before Committing**: Run `npm format` and `npm typecheck`
4. **For Production**: Use `npm build` to create distributable

## Important Notes

- This is an Electron app - be mindful of main vs renderer process separation
- Use the existing i18n system for user-facing text
- Follow the established logging patterns for debugging
- Security tokens and sensitive operations should remain in the main process
- The app uses npm as the package manager - avoid npm/yarn commands

## Technology Stack

- **Runtime**: Electron 37.10.3
- **Build System**: electron-vite 3.1.0 with Vite 6.4.1
- **Frontend**: React 19.2.1 with TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.17
- **Code Quality**: Biome 1.9.4
- **Backend**: Express.js with Socket.io
- **Database**: Supabase
- **Package Manager**: npm