# ScaleUp AI: Your 24/7 Business Consultant

![Image](https://github.com/user-attachments/assets/42d1324e-1d0d-4f49-b468-03cd11a5c493)

ScaleUp AI is an AI-powered business consulting platform that helps small and medium businesses make better decisions. Instead of relying on guesswork or basic spreadsheets, businesses can get smart insights and recommendations to help them grow.

## What It Does

ScaleUp AI focuses on helping Food & Beverage businesses by providing:

- Real-time market insights
- Financial analysis and optimization
- Growth strategy recommendations
- Social media performance tracking

## Features

- **Dashboard**: Business overview and key metrics
- **Financials**: Upload and analyze financial statements
- **Growth Coach**: AI-powered growth strategy coaching
- **Reviews Analytics**: Customer feedback analysis
- **Social Media**: Social media performance tracking
- **Trending Content**: Market trend analysis

## Technology

ScaleUp AI uses advanced AI models and cloud infrastructure to provide fast, reliable business insights.

## Setup & Installation

### Prerequisites

- Node.js 22.x
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables
4. Start development server with `npm run dev`

The application will be available at `http://localhost:5173`

## Deployment & Branch Strategy

### Automated Deployment

- **Main Branch**: Automatically deployed to production environment
- All commits and merges to the `main` branch trigger automatic deployment
- Uses AWS cloud infrastructure for scalability and reliability

### Branch Management

- **main**: Production branch - automatically deployed (DO NOT branch features directly from main)
- **dev**: Development branch - create all new feature branches from this branch
- **feature/\***: Feature branches for new functionality (branch from `dev`)
- **hotfix/\***: Urgent production fixes (branch from `main` only for critical issues)

### Development Workflow

1. Create feature branches from `dev` branch
2. Merge completed features into `dev` for testing
3. Merge `dev` into `main` for production deployment

## License

This project is private and proprietary.

## Contributing

1. Create a feature branch
2. Make your changes
3. Follow the commit message conventions
4. Submit a pull request
