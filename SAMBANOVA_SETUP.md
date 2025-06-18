# SambaNova API Setup Instructions

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# SambaNova API Configuration
VITE_SAMBANOVA_API_KEY=your_sambanova_api_key_here
VITE_SAMBANOVA_BASE_URL=https://api.sambanova.ai/v1
VITE_SAMBANOVA_MODEL=deepseek-v3

# App Configuration
VITE_APP_NAME=Business Growth Hacking Coach
VITE_APP_ENV=development
```

## Getting Your SambaNova API Key

1. Sign up at [SambaNova Cloud](https://cloud.sambanova.ai/)
2. Navigate to API Keys section
3. Generate a new API key
4. Copy the key and paste it in your `.env` file

## DeepSeek-V3 Model

The integration is configured to use the DeepSeek-V3 model from SambaNova's API. This model provides:

- Advanced reasoning capabilities
- Long context understanding
- Specialized business coaching responses
- RAG-enhanced prompt engineering

## Features Implemented

### 🤖 RAG Integration

- Each growth strategy (Bootstrap, Category-Defining, Complete Framework) uses its respective RAG content
- System prompts are dynamically generated with strategy-specific knowledge
- Coaching methodology is embedded in the AI responses

### 🎯 Specialized Coaching

- **Readiness Assessment**: AI asks the 3 critical questions first
- **Structured Process**: Question > Answer > Probe > Response protocol
- **Safety Guardrails**: Singapore compliance and ethical standards
- **F&B Focus**: Specialized advice for food & beverage businesses

### 💬 Chat Features

- Real-time streaming responses
- Loading states and error handling
- Conversation memory within session
- Strategy-specific initialization

## Usage Flow

1. **Select Strategy**: User chooses from 3 growth frameworks
2. **Auto-Initialize**: AI coach initializes with RAG context
3. **Readiness Assessment**: Coach asks assessment questions
4. **Personalized Coaching**: Strategy-specific advice and guidance

## Error Handling

The system includes comprehensive error handling:

- API connection failures
- Invalid responses
- Missing configuration
- User-friendly error messages

## Development

To test the integration:

1. Set up your `.env` file with valid credentials
2. Start the development server: `npm run dev`
3. Navigate to the Growth Coach page
4. Select a strategy and start chatting

The AI will automatically use the RAG content to provide specialized coaching based on your selected growth framework.
