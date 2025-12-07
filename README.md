# GitHub Projects Mobile

Eine mobile-optimierte Web-App zur Verwaltung von GitHub Projects, speziell entwickelt für iPhone 11 und moderne mobile Browser.

## Features

- 📱 **Mobile-First Design** - Optimiert für iPhone 11 mit Apple Glass UI Design
- 🌓 **Dark Mode** - Elegantes dunkles Design mit Glassmorphismus-Effekt
- 👆 **Swipe Navigation** - Wische zwischen Projekt-Spalten hin und her
- ➕ **Items erstellen** - Neue Draft Issues direkt in Projekten erstellen
- 🔄 **Status ändern** - Item-Status per Tap ändern
- 🔐 **GitHub OAuth** - Sichere Authentifizierung über GitHub Personal Access Token
- ⚡ **Serverless** - Vollständig statisch, keine Backend-Infrastruktur erforderlich
- 📦 **PWA-Ready** - Installierbar als Progressive Web App

## Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS mit Glassmorphismus
- **Animationen**: Framer Motion
- **State Management**: Zustand
- **GitHub API**: GraphQL mit Octokit
- **Deployment**: GitHub Pages via GitHub Actions

## Installation & Setup

### 1. GitHub OAuth App (Optional für Entwickler)

Die App nutzt GitHub's Device Flow OAuth. Der öffentliche Client ID ist bereits in der App konfiguriert. Für eine eigene Deployment kannst du eine eigene OAuth App erstellen:

1. Gehe zu [GitHub Settings → Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Erstelle eine neue OAuth App
3. Aktiviere "Device Flow"
4. Kopiere die Client ID und ersetze sie in `src/lib/oauth.ts`

### 2. Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Dev Server starten
npm run dev

# Build erstellen
npm run build

# Preview des Builds
npm run preview
```

## Deployment

Die App wird automatisch über GitHub Actions auf GitHub Pages deployed:

1. Push auf den `main` Branch
2. GitHub Actions baut die App automatisch
3. Deployment auf GitHub Pages
4. Verfügbar unter: `https://[username].github.io/GHPMobile/`

### GitHub Pages aktivieren

1. Gehe zu Repository Settings → Pages
2. Wähle "Deploy from a branch"
3. Wähle `gh-pages` Branch
4. Speichern

## Nutzung

1. Öffne die App im Browser
2. Klicke auf "Mit GitHub anmelden"
3. Autorisiere die App mit dem angezeigten Code auf GitHub
4. Wähle ein Projekt aus deinen GitHub Projects
5. Navigiere durch Spalten per Swipe
6. Tippe auf Items um den Status zu ändern
7. Nutze den ➕ Button um neue Items zu erstellen

## iPhone 11 Optimierungen

- Viewport-fit für Safe Areas (Notch)
- Touch-optimierte Interaktionen
- Optimierte Performance für mobile Geräte
- PWA-Manifest für Installation auf dem Homescreen
- Deaktiviertes Zooming für native App-Feel

## Projektstruktur

```
├── src/
│   ├── components/       # React Komponenten
│   ├── lib/             # GitHub API Client
│   ├── store/           # Zustand State Management
│   ├── types/           # TypeScript Typen
│   ├── App.tsx          # Haupt-App Komponente
│   ├── main.tsx         # Entry Point
│   └── index.css        # Globale Styles
├── public/              # Statische Assets
├── .github/workflows/   # GitHub Actions
└── vite.config.ts       # Vite Konfiguration
```

## Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei