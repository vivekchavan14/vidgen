# Brainrot Video Generator

A web application that generates educational videos in the popular "brainrot" style using AI. Users can input any topic and the system will create an engaging video with AI-generated scripts, character voices, and dynamic visual backgrounds.

## Features

- AI-powered script generation using Groq's Llama model
- Text-to-speech with character voices (Peter Griffin, Stewie Griffin)
- Multiple video style templates (Subway Surfers, Minecraft Parkour, Family Guy clips, etc.)
- Automated video rendering using Remotion
- Cloud storage integration with AWS S3
- Real-time job tracking and progress monitoring

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, tRPC
- **Backend**: Prisma ORM, PostgreSQL
- **AI Services**: OpenAI API, Groq SDK
- **Video Processing**: Remotion
- **Storage**: AWS S3
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- AWS account with S3 bucket
- OpenAI API key
- Groq API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/vivekchavan14/vidgen.git
cd vidgen
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```bash
DATABASE_URL="your_postgresql_connection_string"
OPENAI_API_KEY="your_openai_api_key"
GROQ_API_KEY="your_groq_api_key"
AWS_ACCESS_KEY_ID="your_aws_access_key_id"
AWS_SECRET_ACCESS_KEY="your_aws_secret_access_key"
AWS_BUCKET_NAME="your_s3_bucket_name"
AWS_REGION="your_aws_region"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Navigate to the "Create Video" tab
2. Enter a video title and topic (e.g., "Quantum Physics", "Ancient Rome")
3. Select a character voice and video style
4. Click "Generate Video"
5. Monitor progress in the "My Videos" tab
6. View completed videos once processing is finished

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Prisma Studio
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Utility functions and services
├── remotion/              # Video composition components
├── server/                # tRPC server and API routes
└── pages/api/             # Next.js API routes
```

## Contributing

Contributions are appreciated! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
