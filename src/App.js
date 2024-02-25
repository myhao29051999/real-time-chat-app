import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const socket = new WebSocket('ws://localhost:8080');

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      const message = {
        text: messageInput,
        timestamp: new Date().toISOString(),
      };
      //socket.send(messageInput);
      setMessageInput('');
    }
  };
 
  useEffect(() => {
    socket.onopen = () => {
      console.log('WebSocket Client Connected');
    };
  
    socket.onmessage = (event) => {
      console.log("event,")
        const receivedMessage = event.data;
        setMessages([...messages, receivedMessage]);
     
    };
  
    //return () => {
    //  socket.close();
    //};
  }, []);


  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-messages">
          {messages?.map((message, index) => (
            <div key={index} className="message">
              {message}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
