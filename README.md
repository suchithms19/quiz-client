# Quiz Client

A modern Angular application for creating and managing quiz banks with a reusable component library architecture.

## 🚀 Features

- **Quiz Bank Creation**: Create and manage quiz banks with multiple questions
- **Component Library**: Reusable quiz components (`quiz-components`)
- **State Management**: NgRx store for predictable state management
- **Testing**: Jest testing framework with comprehensive test coverage
- **Docker Support**: Containerized deployment with nginx

## 🛠️ Tech Stack

- **Frontend**: Angular 20.2.0
- **State Management**: NgRx 20.0.1
- **Styling**: SCSS
- **Testing**: Jest 30.1.3

## 📋 Prerequisites

- Node.js 18+ 
- npm 8+
- Docker (optional, for containerized deployment)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/suchithms19/quiz-client
   cd quiz-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The application uses different API endpoints for development and production:
   - **Development**: `http://localhost:3000/api`
   - **Production**: `https://quiz-server-39z8.onrender.com/api`

## 🚦 Development

### Start Development Server
```bash
npm start
# or
ng serve
```
Application runs on `http://localhost:4200`

### Build Library First (if needed)
```bash
ng build quiz-components
```

### Watch Mode
```bash
npm run watch
```

## 🏗️ Build

### Development Build
```bash
ng build --configuration development
```

### Production Build
```bash
npm run build
# or
ng build --configuration production
```

Build artifacts are stored in `dist/quiz-client/browser/`

## 🧪 Testing

### Run Tests
```bash
npm test
# or
jest
```

### Watch Mode
```bash
npm run test:watch
# or
jest --watch
```

### Test Coverage
```bash
jest --coverage
```

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t quiz-client .
```

### Run Container
```bash
docker run -p 8080:80 quiz-client
```

Application will be available at `http://localhost:8080`

### Docker Compose (if available)
```bash
docker-compose up -d
```

## 📁 Project Structure

```
quiz-client/
├── src/                          # Main application source
│   ├── app/
│   │   ├── app.config.ts        # Application configuration
│   │   ├── app.routes.ts        # Routing configuration
│   │   ├── app.ts               # Root component
│   │   └── app.html             # Root template
│   ├── index.html               # Main HTML file
│   ├── main.ts                  # Application bootstrap
│   └── styles.scss              # Global styles
├── projects/quiz-components/     # Reusable component library
│   ├── src/lib/
│   │   ├── components/          # UI Components
│   │   │   ├── createbank/      # Quiz creation component
│   │   │   ├── header/          # Header component
│   │   │   ├── landing/         # Landing page component
│   │   │   └── navbar/          # Navigation component
│   │   ├── services/            # Business logic services
│   │   │   └── quiz.service.ts  # Quiz API service
│   │   ├── store/               # NgRx state management
│   │   │   ├── quiz.actions.ts  # Actions
│   │   │   ├── quiz.effects.ts  # Side effects
│   │   │   ├── quiz.reducer.ts  # Reducers
│   │   │   ├── quiz.selectors.ts# Selectors
│   │   │   └── quiz.state.ts    # State interface
│   │   ├── models/              # TypeScript interfaces and data models
│   │   │   └── quiz.model.ts    # Data models
│   │   └── environments/        # Environment configs
│   └── public-api.ts            # Library exports
├── dist/                        # Build output
├── public/                      # Static assets
├── Dockerfile                   # Docker build file
├── nginx.conf                   # nginx configuration
├── jest.config.js              # Jest configuration
├── angular.json                # Angular workspace config
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🧩 Component Library

The `quiz-components` library provides:

- **Createbank**: Quiz creation form with validation
- **Header**: Application header with branding
- **Landing**: Dashboard with quiz overview
- **Navbar**: Navigation menu
