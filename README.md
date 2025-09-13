# ScriptingCat - AI Social Media Script Analyzer

A powerful AI-powered tool that analyzes viral social media content and generates high-converting scripts for YouTube, TikTok, Instagram, and Threads.

## Features

- **Multi-Platform Support**: Analyze content from YouTube, TikTok, Instagram, and Threads
- **AI-Powered Analysis**: Advanced AI identifies copywriting frameworks, hooks, and conversion techniques
- **Script Generation**: Generate similar high-converting scripts based on analyzed frameworks
- **Subscription Tiers**: 
  - Free: 5 script variations per day
  - Pro ($7.99/month): 50 script variations per day
  - Expert ($19.99/month): 500 script variations per day
- **Usage Tracking**: Real-time usage monitoring and limits
- **Multi-Language Support**: English and Traditional Chinese

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Deployment**: Vercel
- **Database**: Vercel Postgres (for subscription management)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Vercel account (for deployment)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/professorcathk-art/scriptingcat.git
cd scriptingcat
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# OpenAI API Key for AI analysis
OPENAI_API_KEY=your_openai_api_key_here

# Instagram API (optional)
INSTAGRAM_API_KEY=your_instagram_api_key_here

# Database URL (for Vercel deployment)
DATABASE_URL=your_database_url_here
```

## Deployment on Vercel

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `professorcathk-art/scriptingcat`
4. Vercel will automatically detect it's a Next.js project

### 2. Set up Environment Variables

In your Vercel project dashboard:
1. Go to Settings → Environment Variables
2. Add the following variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `DATABASE_URL`: Your database connection string (see database setup below)

### 3. Set up Database

#### Option A: Vercel Postgres (Recommended)

1. In your Vercel project dashboard, go to Storage
2. Click "Create Database" → "Postgres"
3. Choose a name for your database
4. Copy the connection string and add it as `DATABASE_URL` in environment variables

#### Option B: External Database

You can use any PostgreSQL database provider:
- Supabase
- PlanetScale
- Railway
- Neon

### 4. Deploy

1. Push your changes to the main branch
2. Vercel will automatically deploy your application
3. Your app will be available at `https://your-project-name.vercel.app`

## Database Schema

For subscription management, you'll need the following tables:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  daily_usage INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  subscription_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usage logs table
CREATE TABLE usage_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

- `POST /api/analyze` - Analyze social media content
- `POST /api/generate` - Generate scripts based on analysis
- `GET /api/usage` - Get user usage statistics
- `POST /api/subscription` - Manage subscription

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@scriptingcat.com or create an issue on GitHub.

## Roadmap

- [ ] Add more social media platforms
- [ ] Implement team collaboration features
- [ ] Add analytics dashboard
- [ ] Mobile app development
- [ ] API rate limiting improvements
- [ ] Advanced AI models integration