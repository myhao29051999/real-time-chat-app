import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [idInput, setIdInput] = useState('');

  const ws = new WebSocket('ws://localhost:8080');

  // Make the function wait until the connection is made...
  const waitForSocketConnection = (socket, callback) => {
    setTimeout(
      function () {
        if (socket.readyState === 1) {
          console.log("Connection is made")
          if (callback != null) {
            callback();
          }
        } else {
          console.log("wait for connection...")
          waitForSocketConnection(socket, callback);
        }

      }, 5); // wait 5 milisecond for the connection...
  }

  const sendMessage = () => {

    waitForSocketConnection(ws, function () {
      if (messageInput.trim() !== '') {
        const message = {
          type: "message",
          data: idInput + ": " + messageInput,
          timestamp: new Date().toISOString(),
        };
        ws.send(JSON.stringify(message));
        setMessageInput('');
      }
    });
  };

  useEffect(() => {

    ws.onopen = () => {
      console.log('WebSocket connection established.');
    };

    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages([...messages, receivedMessage]);
    };

  }, [messages]);

  return (
    <div className="App">
      <div className="id-input">
        <input
          type="text"
          placeholder="Input your name here"
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
        />
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
      <div className="chat-container">
        <div className="chat-messages">
          {messages?.map((message, index) => (
            <div key={index} className="message">
              {message.data}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
