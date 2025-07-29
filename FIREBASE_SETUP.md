# Firebase Setup Guide

## ✅ Firebase is already installed!

Firebase has been successfully added to your project. Here's how to complete the setup:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name
4. Follow the setup wizard (you can disable Google Analytics if not needed)

## 2. Get Your Firebase Configuration

1. In your Firebase project console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Register your app with a nickname
6. Copy the configuration object

## 3. Update Firebase Configuration

Replace the placeholder values in `src/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## 4. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save the changes

## 5. Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## 6. Test Your Setup

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:5173/firebase`
3. Try signing up with an email and password
4. Test the Firestore functionality by adding messages

## Features Included

- **Authentication**: Sign up, sign in, sign out
- **Firestore**: Add and retrieve messages
- **Real-time updates**: Auth state changes
- **TypeScript support**: Full type safety

## Security Rules (Optional)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Next Steps

- Customize the Firebase example component
- Add more Firebase services (Storage, Functions, etc.)
- Implement proper error handling
- Add loading states
- Style your components

## Troubleshooting

- **"Firebase not initialized"**: Check your configuration in `src/firebase.ts`
- **"Permission denied"**: Enable Authentication and Firestore in Firebase Console
- **"Network error"**: Check your internet connection and Firebase project settings 