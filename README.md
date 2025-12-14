# Weather App

A modern weather application built with React and TypeScript that allows users to search for weather information, view forecasts, and save favorite cities.

## Features

- **Search Weather** - Search for any city and get current weather conditions
- **5-Day Forecast** - View weather forecast for the next 5 days
- **Favorite Cities** - Save your favorite cities for quick access
- **Temperature Units** - Toggle between Celsius and Fahrenheit
- **Responsive Design** - Works on desktop and mobile devices
- **Data Caching** - Smart caching with React Query (repeat searches are instant!)
- **Error Handling** - Graceful error handling with Error Boundaries
- **Loading States** - Beautiful skeleton loading animations

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool and dev server |
| **React Router 7** | Client-side routing |
| **TanStack Query** | Server state management & caching |
| **Axios** | HTTP client |
| **React Hot Toast** | Toast notifications |
| **React Icons** | Icon library |
| **AccuWeather API** | Weather data provider |

## Getting Started

### Prerequisites

- Node.js 18+ installed
- AccuWeather API key ([Get one here](https://developer.accuweather.com/))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your AccuWeather API key to `.env`:
```
VITE_WEATHER_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ErrorBoundary.tsx # Error handling wrapper
│   ├── Header.tsx        # App header with navigation
│   ├── Skeleton.tsx      # Loading skeleton components
│   ├── UnitToggle.tsx    # Temperature unit toggle
│   └── weatherIcons.tsx  # Weather icon mappings
├── contexts/             # React Context providers
│   ├── FavoritesContext.tsx  # Favorites state management
│   └── TemperatureContext.tsx # Temperature unit state
├── hooks/                # Custom React hooks
│   └── useWeather.ts     # Weather data fetching hooks
├── pages/                # Page components
│   ├── HomePage.tsx      # Main search and weather display
│   └── FavoritesPage.tsx # Saved cities list
├── services/             # API services
│   └── weatherService.ts # AccuWeather API calls
├── styles/               # CSS stylesheets
│   ├── App.css           # Global styles + Skeleton + ErrorBoundary
│   ├── Header.css
│   ├── HomePage.css
│   └── FavoritesPage.css
├── types/                # TypeScript type definitions
│   └── index.ts          # All shared types
├── App.tsx               # Root component
├── main.tsx              # Entry point
└── vite-env.d.ts         # Vite environment types
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    QueryClientProvider                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  BrowserRouter                     │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │              FavoritesProvider               │  │  │
│  │  │  ┌───────────────────────────────────────┐  │  │  │
│  │  │  │          TemperatureProvider           │  │  │  │
│  │  │  │  ┌─────────────────────────────────┐  │  │  │  │
│  │  │  │  │          ErrorBoundary           │  │  │  │  │
│  │  │  │  │  ┌───────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │     HomePage / Favorites   │  │  │  │  │  │
│  │  │  │  │  └───────────────────────────┘  │  │  │  │  │
│  │  │  │  └─────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## API Reference

This app uses the [AccuWeather API](https://developer.accuweather.com/apis). The following endpoints are used:

- **Location Search** - `/locations/v1/cities/search`
- **Current Conditions** - `/currentconditions/v1/{locationKey}`
- **5-Day Forecast** - `/forecasts/v1/daily/5day/{locationKey}`

> **Note:** The free tier allows 50 API calls per day.

## Key Features Explained

### React Query Caching
Weather data is cached for 5 minutes. If you search for "London", then search for "Paris", then search for "London" again - the second "London" search will be **instant** (loaded from cache).

### Error Boundaries
If any component crashes, the Error Boundary catches the error and shows a friendly message instead of crashing the entire app.

### Skeleton Loading
Instead of showing "Loading..." text, the app displays animated placeholder shapes that match the layout of the actual content.

## License

MIT
