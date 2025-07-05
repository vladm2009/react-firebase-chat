import React, { useEffect, useState } from "react";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "./firebase.js";
import ChatRoom from "./ChatRoom.js";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert(error.message);
    }
  };

  const signUserOut = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>React Firebase Chat</h1>
      {user ? (
        <>
          <button onClick={signUserOut}>Выйти</button>
          <ChatRoom user={user} />
        </>
      ) : (
        <button onClick={signInWithGoogle}>Войти через Google</button>
      )}
    </div>
  );
}
