import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import './App.css';

const App = () => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') || '');
  const [myNickname, setMyNickname] = useState(() => localStorage.getItem('myNickname') || '');
  const [isLoading, setIsLoading] = useState(true);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const validateToken = async () => {
      if (authToken) {
        try {
          const response = await fetch('/auth/validate', {
            headers: { 'Authorization': `Bearer ${authToken}` }
          });
          const data = await response.json();
          if (!data.valid) {
            handleLogout();
          } else {
            establishWebSocketConnection();
          }
        } catch (error) {
          console.error('Token validation error:', error);
          console.error('Full error object:', JSON.stringify(error, null, 2));
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, [authToken]);

  const establishWebSocketConnection = () => {
    const ws = new WebSocket(`ws://${window.location.host}?token=${authToken}`);
    ws.onopen = () => {
      console.log('Connected to server');
      fetchMessages();
    };
    ws.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.type === 'nicknameSet') {
        setMyNickname(data.nickname);
        localStorage.setItem('myNickname', data.nickname);
      } else if (data.type === 'chat') {
        setMessages(prevMessages => [...prevMessages, data]);
      } else if (data.type === 'error') {
        alert(data.message);
      }
    };
    setSocket(ws);
  };

  const fetchMessages = () => {
    fetch('/messages')
      .then(response => response.json())
      .then(messages => {
        setMessages(messages.map(msg => ({
          id: msg.id,
          nickname: msg.user.nickname,
          message: msg.content,
          created_at: msg.created_at,
        })));
      });
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, nickname }),
      });
      const data = await response.json();

      if (data.token) {
        setAuthToken(data.token);
        localStorage.setItem('authToken', data.token);
        setNickname('');
      }
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();

      if (data.token) {
        setAuthToken(data.token);
        localStorage.setItem('authToken', data.token);
        console.log('Login successful, token saved');
      } else {
        console.log('Login failed, no token received');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    setAuthToken('');
    setMyNickname('');
    localStorage.removeItem('authToken');
    localStorage.removeItem('myNickname');
    if (socket) {
      socket.close();
    }
    console.log('Logged out, token and nickname removed');
  };

  const handleSetNickname = () => {
    const payload = jwtDecode(authToken);
    socket.send(JSON.stringify({ type: 'setNickname', nickname, userId: payload.id }));
  };

  const handleSendMessage = () => {
    if (message) {
      socket.send(JSON.stringify({ type: 'chat', message }));
      setMessage('');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Chat Room</h1>
      {!authToken ? (
        <div>
          <h2>Register</h2>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Enter your nickname" />
          <button onClick={handleRegister}>Register</button>

          <h2>Login</h2>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>
          {!myNickname ? (
            <div>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Enter your nickname" id="nickname" />
              <button onClick={handleSetNickname}>Join Chat</button>
            </div>
          ) : (
            <div>
              <div id="chat">
                {messages.map((msg, index) => (
                  <p key={index} style={{ color: msg.nickname === myNickname ? 'blue' : 'black' }}>
                    <strong>{msg.nickname === myNickname ? `你（${msg.nickname}）` : msg.nickname}</strong>: {msg.message}
                  </p>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <h3>Hello, {myNickname}</h3>
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." id="message" />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;