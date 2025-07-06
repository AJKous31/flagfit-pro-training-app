# 🏈 FlagFit Pro

**Elite Flag Football Training Platform for Athletes, Coaches, and Admins**

A comprehensive web application designed to enhance flag football training through personalized programs, performance tracking, and coaching tools.

## ✨ Features

### 🏃‍♂️ **Athlete Dashboard**
- Personalized training programs
- YouTube video integration for drills
- Performance tracking
- Mobile-responsive design

### 🏆 **Coach Dashboard**
- Team management tools
- Training video sharing
- Athlete progress monitoring
- Session scheduling

### ⚙️ **Admin Dashboard**
- System statistics
- Content management
- User administration
- GDPR compliance tools

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flagfit-pro.git
   cd flagfit-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:8000`

## 🛠️ Development

### Project Structure
```
flagfit-pro/
├── index.html          # Main application entry point
├── style.css           # Custom styles and theming
├── app.js              # Main application logic
├── manifest.webmanifest # PWA configuration
├── sw.js              # Service worker for offline support
├── offline.html       # Offline fallback page
├── icons/             # App icons (to be added)
├── screenshots/       # App screenshots (to be added)
└── package.json       # Project configuration
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with cache disabled
- `npm run build` - Build for production (placeholder)
- `npm test` - Run tests (placeholder)

### Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Pico CSS framework + custom styles
- **PWA**: Service Worker, Web App Manifest
- **Development**: Node.js, http-server

## 📱 Progressive Web App (PWA)

FlagFit Pro is built as a Progressive Web App, providing:
- ✅ Offline functionality
- ✅ Installable on mobile devices
- ✅ App-like experience
- ✅ Fast loading times

## 🔧 Configuration

### YouTube API Integration

To enable YouTube video search functionality:

1. Get a YouTube Data API v3 key from [Google Cloud Console](https://console.developers.google.com/)
2. Replace `'DEMO_KEY'` in `app.js` with your actual API key
3. Enable the YouTube Data API v3 in your Google Cloud project

### PWA Icons

Add your app icons to the `icons/` directory:
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

## 🎯 Roadmap

### Phase 1: Web App Enhancement (Current)
- [x] Basic role-based dashboards
- [x] YouTube integration
- [x] PWA setup
- [x] GDPR compliance
- [ ] User authentication
- [ ] Data persistence
- [ ] Performance optimization

### Phase 2: iOS App Development (Next)
- [ ] Xcode project setup
- [ ] WebView wrapper implementation
- [ ] Native iOS features
- [ ] App Store preparation
- [ ] Testing and optimization

### Phase 3: Advanced Features
- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] Social features
- [ ] Integration with fitness trackers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- Pico CSS for the beautiful styling framework
- YouTube Data API for video integration
- The flag football community for inspiration

---

**Built with ❤️ for the flag football community** 