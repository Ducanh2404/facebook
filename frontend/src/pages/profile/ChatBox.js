import axios from 'axios';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { IoCloseSharp } from "react-icons/io5";
import { getChatMessages } from '../../function/user';

const ChatBox = ({ user, friendUserId, onClose, profile }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const chatId = user.id < friendUserId ? `${user.id}${friendUserId}` : `${friendUserId}${user.id}`;
  const handleInbox = async (e)=>{
    if(e.key === 'Enter'){
      sendMessage()
    }
  }

  const getMessage = async () => {
    const fetchMessage = await getChatMessages(chatId, user.token)
    setMessages(fetchMessage)
  }

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BACKEND_URL);
    newSocket.on('connect', () => {
      console.log('Connected to socket');
    });
    getMessage()
    newSocket.on('chat message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user.id, friendUserId]);

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      socket.emit('chat message', { userId: user.id, friendUserId, text: newMessage,chatId });
      setNewMessage('');
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <span>{`${profile.first_name} ${profile.last_name}`} </span>
        <div onClick={onClose} className="close_icon"><IoCloseSharp /></div>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className='message_text'>
            <span className={message.senderId === user.id ? 'my_message': ''}>{message.senderId === user.id ? `${user.first_name} ${user.last_name}` : `${profile.first_name} ${profile.last_name}`}:</span> <span>{message.text}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Nhắn tin..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyUp={handleInbox}
        />
        <button onClick={sendMessage} className='send_message'>Gửi</button>
      </div>
    </div>
  );
};

export default ChatBox;
