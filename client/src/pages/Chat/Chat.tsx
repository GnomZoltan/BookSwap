import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { getOrCreateConversation } from '../../api/chatApi';
import { jwtDecode } from 'jwt-decode';
import './Chat.css';

interface MessageData {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: { id: string; username: string; photoUrl: string | null };
}

interface ConversationData {
  id: string;
  userA: { id: string; username: string; photoUrl: string | null };
  userB: { id: string; username: string; photoUrl: string | null };
  book: { id: string; title: string };
  messages: MessageData[];
}

const Chat: React.FC = () => {
  const { bookId, userId: otherUserId } = useParams<{ bookId: string; userId: string }>();
  const { accessToken } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loggedUserId = accessToken ? jwtDecode<{ id: string }>(accessToken).id : null;

  const otherUser = conversation
    ? conversation.userA.id === loggedUserId
      ? conversation.userB
      : conversation.userA
    : null;

  useEffect(() => {
    const fetchConversation = async () => {
      if (!bookId || !otherUserId) return;
      try {
        const res = await getOrCreateConversation(bookId, otherUserId);
        setConversation(res.data);
        setMessages(res.data.messages);
      } catch (error) {
        console.error('Failed to load conversation:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversation();
  }, [bookId, otherUserId]);

  useEffect(() => {
    if (!socket || !conversation) return;

    socket.emit('join_conversation', { conversationId: conversation.id });

    const handleNewMessage = (message: MessageData) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.emit('leave_conversation', { conversationId: conversation.id });
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !socket || !conversation) return;
    socket.emit('send_message', {
      conversationId: conversation.id,
      content: input.trim(),
    });
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return <div className="chat__loading"><p>Завантаження...</p></div>;
  }

  if (!conversation) {
    return <div className="chat__loading"><p>Розмову не знайдено</p></div>;
  }

  return (
    <div className="chat">
      <div className="chat__header">
        <button className="chat__back" onClick={() => navigate(-1)} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="chat__header-info" onClick={() => otherUser && navigate(`/profile/${otherUser.id}`)}>
          {otherUser?.photoUrl ? (
            <img src={otherUser.photoUrl} alt={otherUser.username} className="chat__header-avatar" />
          ) : (
            <div className="chat__header-avatar chat__header-avatar--placeholder">
              {otherUser?.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="chat__header-name">{otherUser?.username}</p>
            <p className="chat__header-book">{conversation.book.title}</p>
          </div>
        </div>
      </div>

      <div className="chat__messages">
        {messages.length === 0 && (
          <div className="chat__empty">
            <p>Почніть розмову про «{conversation.book.title}»</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.senderId === loggedUserId;
          return (
            <div key={msg.id} className={`chat__bubble ${isMine ? 'chat__bubble--sent' : 'chat__bubble--received'}`}>
              <p className="chat__bubble-content">{msg.content}</p>
              <span className="chat__bubble-time">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat__input-area">
        <input
          className="chat__input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Написати повідомлення..."
        />
        <button
          className="chat__send"
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Send"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chat;
