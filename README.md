# 🍅 Pomodoro Timer

A modern, responsive web application for the Pomodoro time management technique, built with React and Vite.
Jira link: https://pomodoroweb.atlassian.net/jira/core/projects/PMDR/board?filter=&groupBy=status&atlOrigin=eyJpIjoiZWFhNDEyYjgwY2ZhNDRiNGIyZmU5ZGYzMDAxOTNiYTUiLCJwIjoiaiJ9
## Features

✅ **Customizable Timer**

- Default: 25 min work, 5 min short break, 15 min long break
- Adjustable durations in settings

✅ **Session Management**

- Automatic cycle: Work → Short Break → Work → Long Break
- Session counter
- Progress visualization

✅ **Notifications**

- Browser notifications when sessions complete
- Sound alerts (customizable)
- Works even when tab is not focused

✅ **Statistics**

- Track completed sessions
- Daily progress overview
- Weekly activity chart
- History of last 14 days

✅ **Themes**

- Light and dark mode
- Smooth theme switching
- Persistent preference

✅ **Responsive Design**

- Mobile-friendly interface
- Tablet and desktop support
- Touch-optimized controls

## Tech Stack

- **Frontend**: React 18.2+
- **Build Tool**: Vite 4.4+
- **Styling**: CSS3 with CSS Variables
- **Storage**: Browser Local Storage
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

if don`t work please, terminal cmd or Set-ExecutionPolicy-Scope Process-ExecutionPolicy Bypass

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Timer.jsx              # Main timer display
│   ├── SessionManager.jsx     # Technique explanation
│   ├── Settings.jsx           # Duration & sound settings
│   └── Statistics.jsx         # Progress & history
├── hooks/
│   ├── useTimer.js            # Timer logic
│   └── useStatistics.js       # Stats & storage
├── contexts/
│   └── ThemeContext.jsx       # Theme management
├── styles/
│   ├── index.css              # Global styles
│   ├── App.css                # App layout
│   ├── Timer.css              # Timer component
│   ├── SessionManager.css     # Session info
│   ├── Settings.css           # Settings panel
│   └── Statistics.css         # Statistics panel
├── App.jsx                    # Main component
└── main.jsx                   # Entry point
```

## Usage

1. **Start Timer**: Click the green "Start" button
2. **Customize**: Click "Settings" to adjust durations
3. **View Stats**: Click "Statistics" to see progress
4. **Switch Theme**: Click moon icon in header (☀️/🌙)

## Features in Detail

### Timer Display

- Large circular progress indicator
- MM:SS format
- Color-coded sessions (green=work, blue=break, orange=long break)

### Notifications

- Browser notifications (with permission)
- Web Audio API sound alerts
- Toggleable in settings

### Data Persistence

- Settings saved to Local Storage
- Session history stored automatically
- Theme preference remembered

### Responsive Breakpoints

- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Team

**Project Team** (M101 Document)

- Team Lead: Denys Fedyna (CS-33)
- Project Manager: Volodymyr Homu (CSAI-31)
- Software Engineers:
  - Eduard Tuhanov (CS-33)
  - Roman Kravets (CSAI-31)
  - Artem Boychuk (CS-32)

## License

Educational Project - TRPZ Course

## Contributing

Feedback and contributions welcome! Please submit issues or pull requests.

---

**Made with ❤️ by the Pomodoro Timer Team**
