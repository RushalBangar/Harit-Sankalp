import { auth, db, isFirebaseConfigured } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged as fbOnAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// LOCAL STORAGE MOCK DATABASE KEY KEYS
const USERS_KEY = 'harit_users';
const CURRENT_USER_KEY = 'harit_current_user';

// Helper to get local mock users
const getMockUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : {};
};

// Helper to save local mock users
const saveMockUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
  // Sign Up a new user
  signUp: async (email, password, role, name, businessDetails = {}) => {
    if (isFirebaseConfigured) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save user profile details to Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const profile = {
        uid: user.uid,
        email,
        role, // 'citizen', 'business', 'government'
        name,
        createdAt: new Date().toISOString(),
        points: role === 'citizen' ? 0 : null,
        ...businessDetails // e.g. businessName, discountDetails
      };
      await setDoc(userDocRef, profile);
      return profile;
    } else {
      // Local Mock Database
      const users = getMockUsers();
      if (users[email]) {
        throw new Error('User already exists');
      }
      
      const uid = 'mock_uid_' + Math.random().toString(36).substr(2, 9);
      const profile = {
        uid,
        email,
        role,
        name,
        createdAt: new Date().toISOString(),
        points: role === 'citizen' ? 0 : null,
        ...businessDetails
      };
      
      users[email] = { ...profile, password }; // Store password locally for mock login
      saveMockUsers(users);
      
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
      return profile;
    }
  },

  // Sign In an existing user
  signIn: async (email, password) => {
    if (isFirebaseConfigured) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch user profile from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error('User profile data not found in database');
      }
    } else {
      // Local Mock Database
      const users = getMockUsers();
      const userRecord = users[email];
      
      if (!userRecord || userRecord.password !== password) {
        throw new Error('Invalid email or password');
      }
      
      const { password: _, ...profile } = userRecord;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
      return profile;
    }
  },

  // Sign Out
  signOut: async () => {
    if (isFirebaseConfigured) {
      await fbSignOut(auth);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // Subscribe to Authentication State changes
  onAuthStateChanged: (callback) => {
    if (isFirebaseConfigured) {
      return fbOnAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            const userDocRef = doc(db, 'users', fbUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              callback(userDoc.data());
            } else {
              callback(null);
            }
          } catch (err) {
            console.error("Error fetching user session profile: ", err);
            callback(null);
          }
        } else {
          callback(null);
        }
      });
    } else {
      // Local Mock checks
      const checkUser = () => {
        const currentUser = localStorage.getItem(CURRENT_USER_KEY);
        callback(currentUser ? JSON.parse(currentUser) : null);
      };
      
      // Trigger initially
      checkUser();
      
      // Listen to storage changes to keep tabs synced
      window.addEventListener('storage', checkUser);
      
      // Return cleanup function
      return () => {
        window.removeEventListener('storage', checkUser);
      };
    }
  }
};
