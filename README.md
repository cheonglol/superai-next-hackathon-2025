# Social Media Reviews Dashboard

A production-ready React application for analyzing and visualizing social media reviews across multiple platforms.

## Features

- **Multi-platform Analytics**: Aggregate reviews from Google, Facebook, TripAdvisor, Chope, and more
- **Sentiment Analysis**: AI-powered keyword categorization with positive/negative sentiment tracking
- **Category Ratings**: Track performance across Food Quality, Service, Ambience, and Value for Money
- **Trend Analysis**: Compare current performance against historical periods
- **Export Functionality**: Generate PDF reports for stakeholder sharing
- **Responsive Design**: Optimized for desktop and mobile viewing

## Architecture

This application follows a clean, modular architecture with clear separation of concerns:

```
src/
├── components/          # Reusable UI components
├── config/             # Application configuration
├── hooks/              # Custom React hooks
├── http/               # HTTP client and API utilities
├── services/           # Business logic and API services
├── shared/             # Shared utilities and components
├── types/              # TypeScript type definitions
└── utils/              # Helper functions and formatters
```

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Code Quality**: ESLint with TypeScript support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your API configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
```

## API Integration

The application is designed to work with a REST API. Key endpoints:

- `GET /reviews/analytics` - Fetch review analytics data
- `GET /reviews/export` - Export reports as PDF
- `GET /reviews/keywords` - Get keyword analysis
- `GET /reviews/platforms` - Platform distribution data

### Mock Data

For development, the application uses mock data services. Switch to production API by updating the environment configuration.

## Configuration

### Environment Variables

- `VITE_API_BASE_URL` - Base URL for the API
- `VITE_APP_ENV` - Application environment (development/production)

### TypeScript Configuration

The project uses a strict TypeScript configuration with path aliases for clean imports:

- `@/components/*` - UI components
- `@/services/*` - Business logic services
- `@/types/*` - Type definitions
- `@/utils/*` - Utility functions
- `@/config/*` - Configuration files

## Development Guidelines

### Code Organization

- **Components**: Single responsibility, reusable UI components
- **Services**: Business logic and API interactions
- **Hooks**: Custom React hooks for state management
- **Types**: Comprehensive TypeScript definitions
- **Utils**: Pure functions for data transformation

### Best Practices

- Use TypeScript strict mode
- Implement proper error handling
- Follow React best practices (hooks, functional components)
- Maintain consistent code formatting with ESLint
- Write self-documenting code with clear naming

## Deployment

The application is ready for deployment to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure environment variables for production

## Contributing

1. Follow the established code structure
2. Maintain TypeScript strict compliance
3. Add proper error handling for new features
4. Update documentation for significant changes

## License

This project is proprietary and confidential.