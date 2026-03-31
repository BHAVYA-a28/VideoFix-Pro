import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  deleteDoc, 
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebase';

// Helper to get current user ID
const getUserId = () => auth.currentUser?.uid;

// Generic sync function: localStorage -> Firestore
export const syncToCloud = async (collectionName: string, data: any[]) => {
  const userId = getUserId();
  if (!userId) return;

  try {
    const userDocRef = doc(db, 'users', userId);
    const colRef = collection(userDocRef, collectionName);
    
    // In a production app, we'd do a more sophisticated merge.
    // For this implementation, we'll overwrite to ensure consistency.
    for (const item of data) {
      const itemRef = doc(colRef, item.id);
      await setDoc(itemRef, {
        ...item,
        updatedAt: serverTimestamp(),
        userId
      }, { merge: true });
    }
    console.log(`Synced ${data.length} items to ${collectionName}`);
  } catch (error) {
    console.error(`Sync error for ${collectionName}:`, error);
  }
};

// Generic fetch function: Firestore -> App State
export const fetchFromCloud = async (collectionName: string) => {
  const userId = getUserId();
  if (!userId) return [];

  try {
    const userDocRef = doc(db, 'users', userId);
    const colRef = collection(userDocRef, collectionName);
    const q = query(colRef, orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
  } catch (error) {
    console.error(`Fetch error for ${collectionName}:`, error);
    return [];
  }
};

// --- Project Specific ---
export const saveProject = async (project: any) => {
  const userId = getUserId();
  if (!userId) return;
  const ref = doc(db, 'users', userId, 'projects', project.id);
  await setDoc(ref, { ...project, updatedAt: serverTimestamp() }, { merge: true });
};

export const deleteProjectFromCloud = async (projectId: string) => {
  const userId = getUserId();
  if (!userId) return;
  await deleteDoc(doc(db, 'users', userId, 'projects', projectId));
};

// --- Media Specific ---
export const saveMediaItem = async (item: any) => {
  const userId = getUserId();
  if (!userId) return;
  const ref = doc(db, 'users', userId, 'media', item.id);
  await setDoc(ref, { ...item, updatedAt: serverTimestamp() }, { merge: true });
};

// --- Activity Specific ---
export const logActivity = async (activity: any) => {
  const userId = getUserId();
  if (!userId) return;
  const ref = doc(db, 'users', userId, 'activities', activity.id);
  await setDoc(ref, { ...activity, timestamp: serverTimestamp() });
};
