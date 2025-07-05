import React, { useEffect, useState, useRef } from "react";
import {
  db,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from "./firebase.js";

export default function ChatRoom({ user }) {
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState("");
  const dummy = useRef();

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs.reverse());
      dummy.current?.scrollIntoView({ behavior: "smooth" });
    });
    return unsubscribe;
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (formValue.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      text: formValue,
      uid: user.uid,
      displayName: user.displayName,
      createdAt: serverTimestamp()
    });

    setFormValue("");
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div style={{ height: 400, overflowY: "auto", border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
        {messages.map((msg) => (
          <p
            key={msg.id}
            style={{
              padding: "8px 12px",
              borderRadius: 15,
              backgroundColor: msg.uid === user.uid ? "#DCF8C6" : "#FFF",
              textAlign: msg.uid === user.uid ? "right" : "left",
              maxWidth: "70%",
              marginLeft: msg.uid === user.uid ? "auto" : 0,
              marginBottom: 8
            }}
          >
            <strong>{msg.displayName}: </strong> {msg.text}
          </p>
        ))}
        <div ref={dummy}></div>
      </div>
      <form onSubmit={sendMessage}>
        <input
          style={{ width: "80%", padding: 8 }}
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Введите сообщение"
        />
        <button type="submit" style={{ padding: 8, marginLeft: 5 }}>
          Отправить
        </button>
      </form>
    </div>
  );
}
