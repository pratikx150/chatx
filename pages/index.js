import { useEffect, useState, useRef } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    setUser(prompt('Enter your username'));
    // Fetch existing messages
    fetch('/api/messages')
      .then(res => res.json())
      .then(setMessages);

    // Setup Socket.IO
    socketRef.current = new window.io();

    socketRef.current.on('receive-message', msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    const msg = { user, content: input };
    // Save to DB
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
    const savedMsg = await res.json();
    setMessages(prev => [...prev, savedMsg]);
    setInput('');
    // Emit via socket
    socketRef.current.emit('new-message', savedMsg);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.user === user ? 'me' : 'other'}>
            <b>{m.user}</b>: {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type message..."
          required
        />
        <button type="submit">Send</button>
      </form>
      <style jsx>{`
        .chat-container { max-width: 400px; margin: 40px auto; border: 1px solid #ccc; padding: 20px; }
        .messages { height: 300px; overflow-y: scroll; margin-bottom: 10px; }
        .me { text-align: right; color: blue; }
        .other { text-align: left; color: green; }
        input { width: 70%; }
        button { width: 25%; }
      `}</style>
    </div>
  );
}
