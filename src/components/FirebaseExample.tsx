import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';

const FirebaseExample: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Signed in successfully!');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage('Account created successfully!');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setMessage('Signed out successfully!');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const addMessage = async () => {
    if (!user) return;
    
    try {
      await addDoc(collection(db, 'messages'), {
        text: message,
        userId: user.uid,
        email: user.email,
        timestamp: new Date()
      });
      setMessage('');
    } catch (error: any) {
      console.error('Error adding message:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    } catch (error: any) {
      console.error('Error loading messages:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Firebase Example</h2>
      
      {!user ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Authentication</h3>
          <form onSubmit={handleSignIn} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={handleSignUp}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Signed in as: {user.email}</p>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Firestore Example</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={addMessage}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Add Message
              </button>
              <button
                onClick={loadMessages}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
              >
                Load Messages
              </button>
            </div>
            
            {messages.length > 0 && (
              <div>
                <h4 className="font-semibold">Messages:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-2 bg-gray-100 rounded text-sm">
                      <p><strong>{msg.email}:</strong> {msg.text}</p>
                      <p className="text-xs text-gray-500">
                        {msg.timestamp?.toDate?.()?.toLocaleString() || 'Unknown time'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseExample; 