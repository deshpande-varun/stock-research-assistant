import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          const defaultData = {
            email: user.email,
            displayName: user.displayName,
            subscriptionTier: 'free',
            watchlists: [],
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', user.uid), defaultData);
          setUserData(defaultData);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', result.user.uid), {
      email,
      displayName,
      subscriptionTier: 'free',
      watchlists: [],
      createdAt: new Date().toISOString()
    });
    return result;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName,
        subscriptionTier: 'free',
        watchlists: [],
        createdAt: new Date().toISOString()
      });
    }
    return result;
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    userData,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
