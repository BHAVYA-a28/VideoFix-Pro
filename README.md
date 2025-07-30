# VideoFix Pro - Plugin Management System

A comprehensive React application that combines Firebase authentication with automatic video editing software plugin detection and installation.

## 🚀 Features

### 🔐 Authentication System
- **Firebase Authentication** - Email/password registration and login
- **Protected Routes** - Secure dashboard access
- **Real-time Auth State** - Automatic user state management
- **Modern UI/UX** - Beautiful responsive design with Tailwind CSS

### 🔍 Plugin Detection & Management
- **Automatic Software Detection** - Scans for installed video editing software
- **Plugin Discovery** - Identifies missing and installed plugins
- **Smart Recommendations** - Suggests plugins based on detected software
- **One-Click Installation** - Automated plugin download and installation
- **Progress Tracking** - Real-time installation progress with visual feedback

### 🎯 Supported Software
- **Adobe After Effects** - Visual effects and motion graphics
- **Adobe Premiere Pro** - Video editing and post-production
- **DaVinci Resolve** - Professional color grading and editing
- **Blender** - 3D modeling and animation

### 🔌 Supported Plugins
- **Video Copilot** - Professional visual effects
- **Trapcode Suite** - Particle systems and 3D objects
- **Red Giant** - Color grading and visual effects
- **Sapphire** - Professional transitions and effects
- **Twixtor** - Time remapping and motion interpolation
- **Optical Flares** - Lens flares and light effects
- **Element 3D** - 3D object integration
- **Particular** - Advanced particle systems

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5.4.8
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore (optional)
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BHAVYA-a28/VideoFix-Pro.git
   cd VideoFix-Pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Update `src/firebase.ts` with your Firebase config

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🌐 Usage

### Authentication
- **Signup**: Create new accounts at `/signup`
- **Login**: Sign in existing users at `/login`
- **Dashboard**: Protected user area at `/dashboard`

### Plugin Management
- **Scan System**: Automatically detect installed software and plugins
- **Install Plugins**: One-click installation with progress tracking
- **Bulk Operations**: Install multiple plugins simultaneously
- **Search & Filter**: Find specific plugins quickly

### Key Pages
- **Home** (`/`) - Landing page
- **Dashboard** (`/dashboard`) - Protected user area
- **Plugin Manager** (`/plugins`) - Plugin detection and installation
- **Services** (`/services`) - Service offerings
- **Contact** (`/contact`) - Contact information

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Update `src/firebase.ts` with your configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Plugin Detection
The system automatically detects:
- Windows Registry entries for software installation
- Default installation paths
- Plugin directories and files
- Software version information

## 🚀 Deployment

### Netlify Deployment
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy automatically on push to main branch

### Environment Variables
Set these in your deployment platform:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Navigation with auth state
│   ├── Footer.tsx              # Footer component
│   ├── ProtectedRoute.tsx      # Route protection
│   └── FirebaseExample.tsx     # Firebase demo
├── pages/
│   ├── Home.tsx                # Landing page
│   ├── Login.tsx               # Login form
│   ├── Signup.tsx              # Registration form
│   ├── Dashboard.tsx           # Protected dashboard
│   ├── PluginManager.tsx       # Plugin management
│   ├── Services.tsx            # Services page
│   └── Contact.tsx             # Contact page
├── services/
│   ├── pluginDetector.ts       # Software detection
│   └── pluginInstaller.ts      # Plugin installation
├── contexts/
│   └── AuthContext.tsx         # Global auth state
├── firebase.ts                 # Firebase configuration
└── App.tsx                     # Main app component
```

## 🔒 Security Features

- **Protected Routes** - Authentication required for sensitive pages
- **Firebase Security** - Server-side authentication validation
- **Input Validation** - Form validation and sanitization
- **Error Handling** - Comprehensive error management

## 🎨 UI/UX Features

- **Responsive Design** - Works on all device sizes
- **Modern UI** - Clean, professional interface
- **Loading States** - Visual feedback for all operations
- **Progress Tracking** - Real-time installation progress
- **Search & Filter** - Easy plugin discovery

## 🔄 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Plugins
1. Update `PLUGIN_DOWNLOADS` in `src/services/pluginInstaller.ts`
2. Add plugin information and download URLs
3. Update compatibility requirements

### Adding New Software
1. Update `SUPPORTED_SOFTWARE` in `src/services/pluginDetector.ts`
2. Add default installation paths
3. Define supported plugins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the Firebase setup guide
- Review the plugin detection documentation

---

**Built with ❤️ using React, Firebase, and modern web technologies** 