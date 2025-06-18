# Plant Bean Stalk - Business Growth Hacking Coach

A comprehensive React + TypeScript application for business growth analysis and coaching, featuring AI-powered insights, financial analysis, and data-driven growth strategies.

## 🚀 Features

### Core Modules

- **📊 Dashboard**: Business overview and key metrics
- **💰 Financials**: Upload and analyze P&L statements and balance sheets
- **🤖 Growth Coach**: AI-powered growth strategy coaching with RAG integration
- **⭐ Reviews Analytics**: Customer feedback analysis and insights
- **📱 Social Media**: Social media footprint and engagement tracking
- **📈 Trending Content**: Market trend analysis and content insights

### Key Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **AI Integration**:
  - SambaNova LLM Provider with DeepSeek (Growth Coach)
  - SambaNova LLM Provider with Mistral (Financials)
- **Data APIs**:
  - BrightData API (Social Media)
  - Mastra.ai (Financial Analysis)
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components for each module
├── hooks/              # Custom React hooks
├── services/           # API services and mock data
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
├── config/             # Configuration files
└── utils/              # Utility functions
```

## 🔌 API Integration

### Financials API

The application integrates with multiple services for comprehensive financial analysis:

**Primary Endpoint**: `https://hf3ifrfjgk.us-west-2.awsapprunner.com`
**Financial Analysis**: Mastra.ai
**AI Processing**: SambaNova LLM Provider with Mistral model

This integration provides:

- Processing uploaded financial documents (P&L, Balance Sheet)
- Extracting structured financial data using Mastra.ai
- AI-powered financial insights via SambaNova + Mistral
- Performing complex financial analysis and calculations

### Social Media API

**Data Provider**: BrightData API

Features include:

- Social media footprint analysis
- Engagement metrics tracking
- Platform performance insights
- Real-time social data collection

### Growth Coach AI

**AI Provider**: SambaNova LLM Provider with DeepSeek model

Capabilities:

- RAG-enhanced coaching strategies
- Context-aware business advice
- Strategy-specific knowledge application
- Real-time conversational coaching

### API Documentation

Complete API documentation is available at: [Mastra Dev API Documentation](https://github.com/sayyidkhan/mastra-dev/blob/main/API.md)

The documentation includes:

- Authentication methods
- Endpoint specifications
- Request/response formats
- Error handling
- Rate limiting information

---

## 📋 Financials Backend API Documentation

**Base URL**: `https://hf3ifrfjgk.us-west-2.awsapprunner.com`

### Authentication

```http
Authorization: Bearer {your_api_token}
Content-Type: application/json
```

### Endpoints

#### 1. Upload Financial Document

**POST** `/api/financials/upload`

Upload and process financial documents (P&L, Balance Sheet) using Mastra.ai for extraction and SambaNova + Mistral for analysis.

**Request:**

```json
{
  "document_type": "profit_loss" | "balance_sheet",
  "file": "base64_encoded_file_content",
  "file_name": "document.pdf",
  "branch_id": "string",
  "period": "2024-Q1"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "document_id": "doc_123456",
    "extracted_data": {
      "revenue": 150000,
      "gross_margin": 45000,
      "net_profit_after_tax": 25000,
      "total_assets": 300000,
      "current_liabilities": 75000
    },
    "ai_insights": {
      "summary": "Strong revenue growth with healthy margins",
      "recommendations": ["Consider expanding market reach", "Optimize cost structure"],
      "risk_factors": ["High dependency on single revenue stream"]
    },
    "processing_status": "completed"
  }
}
```

#### 2. Get Financial Analysis

**GET** `/api/financials/analysis/{document_id}`

Retrieve comprehensive financial analysis powered by SambaNova + Mistral.

**Response:**

```json
{
  "status": "success",
  "data": {
    "financial_metrics": {
      "profitability_ratios": {
        "gross_profit_margin": 0.3,
        "net_profit_margin": 0.167,
        "return_on_assets": 0.083
      },
      "liquidity_ratios": {
        "current_ratio": 2.5,
        "quick_ratio": 1.8
      }
    },
    "ai_analysis": {
      "performance_summary": "Company shows strong financial health",
      "growth_opportunities": ["Digital transformation", "Market expansion"],
      "improvement_areas": ["Inventory management", "Debt optimization"]
    },
    "predictions": {
      "next_quarter_revenue": 165000,
      "confidence_score": 0.85
    }
  }
}
```

#### 3. Batch Process Documents

**POST** `/api/financials/batch-upload`

Process multiple financial documents simultaneously.

**Request:**

```json
{
  "documents": [
    {
      "document_type": "profit_loss",
      "file": "base64_content_1",
      "file_name": "Q1_PL.pdf",
      "period": "2024-Q1"
    },
    {
      "document_type": "balance_sheet",
      "file": "base64_content_2",
      "file_name": "Q1_BS.pdf",
      "period": "2024-Q1"
    }
  ],
  "branch_id": "branch_001"
}
```

#### 4. Generate Financial Report

**POST** `/api/financials/report/generate`

Generate comprehensive financial reports with AI insights.

**Request:**

```json
{
  "branch_ids": ["branch_001", "branch_002"],
  "period_range": {
    "start": "2024-Q1",
    "end": "2024-Q4"
  },
  "report_type": "comprehensive" | "summary",
  "include_predictions": true
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "report_id": "report_789",
    "download_url": "https://hf3ifrfjgk.us-west-2.awsapprunner.com/reports/report_789.pdf",
    "summary": {
      "total_revenue": 600000,
      "growth_rate": 0.15,
      "ai_score": 8.5
    }
  }
}
```

#### 5. Real-time Financial Chat

**POST** `/api/financials/chat`

Interactive financial analysis powered by SambaNova + Mistral.

**Request:**

```json
{
  "message": "What's the trend in our cash flow?",
  "context": {
    "branch_id": "branch_001",
    "document_ids": ["doc_123", "doc_456"]
  },
  "conversation_id": "conv_789"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "response": "Based on your financial data, cash flow has improved by 23% over the last quarter...",
    "supporting_data": {
      "cash_flow_trend": [45000, 52000, 55000],
      "key_drivers": ["Increased collections", "Reduced expenses"]
    },
    "conversation_id": "conv_789"
  }
}
```

### Error Handling

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_DOCUMENT",
    "message": "Document format not supported",
    "details": "Only PDF, Excel, and CSV formats are accepted"
  }
}
```

### Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `422` - Validation Error
- `500` - Internal Server Error

### Rate Limits

- Document Upload: 10 requests/minute
- Analysis Requests: 50 requests/minute
- Chat Requests: 30 requests/minute

### Tech Stack Integration

- **Mastra.ai**: Document parsing and data extraction
- **SambaNova + Mistral**: AI analysis, insights generation, and chat functionality
- **AWS App Runner**: Scalable backend infrastructure

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 22.x
- npm or yarn

### Environment Variables

Create a `.env` file in the project root:

```env
# SambaNova API Configuration
VITE_SAMBANOVA_API_KEY=your_sambanova_api_key_here
VITE_SAMBANOVA_BASE_URL=https://api.sambanova.ai/v1
VITE_SAMBANOVA_DEEPSEEK_MODEL=deepseek-v3
VITE_SAMBANOVA_MISTRAL_MODEL=mistral-latest

# BrightData API Configuration
VITE_BRIGHTDATA_API_KEY=your_brightdata_api_key_here
VITE_BRIGHTDATA_BASE_URL=https://api.brightdata.com

# Mastra.ai Configuration
VITE_MASTRA_API_KEY=your_mastra_api_key_here
VITE_MASTRA_BASE_URL=https://api.mastra.ai

# App Configuration
VITE_APP_NAME=Business Growth Hacking Coach
VITE_APP_ENV=development

# API Configuration
VITE_API_BASE_URL=https://hf3ifrfjgk.us-west-2.awsapprunner.com
```

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd superai-next-hackathon-2025
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` (or `5174` if 5173 is in use)

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run deploy` - Deploy to AWS (requires setup)

## 🤖 AI Integration

The application features dual AI integration powered by SambaNova LLM Provider:

### Growth Coach AI (DeepSeek Model)

- **RAG Integration**: Each growth strategy uses specific knowledge bases
- **Specialized Coaching**: Bootstrap, Category-Defining, and Complete Framework strategies
- **Real-time Streaming**: Live conversation with AI coach
- **Context Awareness**: Session memory and strategy-specific responses

### Financial Analysis AI (Mistral Model)

- **Document Processing**: Intelligent extraction from financial documents
- **Data Analysis**: Advanced financial metrics calculation
- **Insights Generation**: AI-powered financial recommendations
- **Pattern Recognition**: Trend analysis and forecasting

### Growth Strategies

1. **Bootstrap Strategy**: For early-stage businesses
2. **Category-Defining Strategy**: For market leaders
3. **Complete Framework**: Comprehensive growth approach

## 💰 Financials Module

### Document Upload

- Support for PDF, Excel, and CSV formats
- Automatic data extraction and processing
- P&L Statement and Balance Sheet analysis

### Features

- Multi-branch financial management
- Consolidated view across all branches
- Period-based analysis (daily, weekly, monthly, quarterly, yearly)
- Real-time financial calculations
- Data validation and error handling

### API Integration

The financials module integrates with multiple services for comprehensive analysis:

**Mastra.ai Integration**:

- Intelligent document parsing and data extraction
- Structured financial data processing
- Advanced analytics and pattern recognition

**SambaNova + Mistral Integration**:

- AI-powered financial insights generation
- Natural language financial analysis
- Predictive modeling and forecasting
- Automated recommendation systems

## 🔧 Development

### Code Quality

- ESLint configuration with TypeScript support
- Prettier for code formatting
- Husky for pre-commit hooks
- Commitlint for conventional commits

### Architecture

- Component-based architecture
- Custom hooks for data management
- Redux for global state management
- Service layer for API abstractions
- Type-safe with TypeScript

## 🚀 Deployment

The application supports deployment to AWS Elastic Beanstalk:

```bash
npm run deploy-package  # Create deployment package
npm run deploy          # Deploy to AWS
```

## 📋 License

This project is private and proprietary.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Follow the commit message conventions
4. Submit a pull request

## 📞 Support

For API-related issues, refer to the [API Documentation](https://github.com/sayyidkhan/mastra-dev/blob/main/API.md) or contact the development team.
