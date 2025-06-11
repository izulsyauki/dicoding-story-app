# Dicoding Story App - Api From Dicoding Made By Izulsyauki

A progressive web application (PWA) for sharing stories with location-based features. Users can share their experiences through stories with images and specific locations, creating a rich and interactive storytelling platform.

## Features

-   User authentication (login/register)
-   Create stories with images (upload or camera capture)
-   Location-based storytelling with interactive maps
-   View stories in map view
-   Save stories for offline viewing
-   Push notifications
-   Responsive design for all devices
-   PWA support for offline functionality

## Tech Stack

-   HTML5, CSS3, JavaScript
-   [Vite](https://vitejs.dev/) - Frontend build tool
-   [Leaflet](https://leafletjs.com/) - Interactive maps
-   [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (via idb) - Offline data storage
-   [Workbox](https://developers.google.com/web/tools/workbox) - Service worker and PWA functionality

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   npm (usually comes with Node.js)

## Installation

1. Clone the repository

```bash
git clone https://github.com/izulsyauki/dicoding-story-app.git
cd starter-project-with-vite
```

2. Install dependencies

```bash
npm install
```

## Running the Application

1. Development mode

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

2. Build for production

```bash
npm run build
```

3. Preview production build

```bash
npm run preview
```

## Project Structure

```
src/
├── index.html              # Main HTML file
├── public/                 # Static assets
│   ├── favicon.png
│   └── images/
├── scripts/               # JavaScript files
│   ├── config.js         # App configuration
│   ├── data/            # Data layer (API, Database)
│   ├── pages/           # Page components
│   ├── routes/          # Routing logic
│   └── utils/           # Utility functions
└── styles/              # CSS styles
    └── styles.css

```

## Features in Detail

### Authentication

-   User registration with email
-   Secure login system
-   Token-based authentication

### Story Creation

-   Rich text description
-   Image upload support
-   Camera integration for taking photos
-   Location tagging with interactive map

### Maps Integration

-   View stories on an interactive map
-   Location-based storytelling
-   Custom markers for story locations

### Offline Support

-   Save stories for offline viewing
-   PWA installation support
-   Service worker for caching

### Push Notifications

-   Subscribe to notifications
-   Receive updates for new stories
-   Notification management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

Izulsyauki Imani - [https://github.com/izulsyauki]

Project Link: [https://github.com/izulsyauki/dicoding-story-app.git]
