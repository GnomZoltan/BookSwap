import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserConversations } from '../../api/chatApi';
import { jwtDecode } from 'jwt-decode';
import './Conversations.css';

interface ConversationItem {
  id: string;
  bookId: string;
  userA: { id: string; username: string; photoUrl: string | null };
  userB: { id: string; username: string; photoUrl: string | null };
  book: { id: string; title: string; photos: { photoUrl: string }[] };
  messages: { content: string; createdAt: string; sender: { username: string } }[];
}

const Conversations: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const loggedUserId = accessToken ? jwtDecode<{ id: string }>(accessToken).id : null;

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getUserConversations();
        setConversations(res.data);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return <div className="conversations__loading"><p>Завантаження...</p></div>;
  }

  return (
    <div className="conversations">
      <h1 className="conversations__title">Повідомлення</h1>
      {conversations.length === 0 ? (
        <div className="conversations__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p>У вас поки що немає повідомлень</p>
        </div>
      ) : (
        <div className="conversations__list">
          {conversations.map((conv) => {
            const otherUser = conv.userA.id === loggedUserId ? conv.userB : conv.userA;
            const lastMsg = conv.messages[0];
            const bookPhoto = conv.book.photos?.[0]?.photoUrl;

            return (
              <div
                key={conv.id}
                className="conversations__item"
                onClick={() => navigate(`/chat/${conv.book.id}/${otherUser.id}`)}
              >
                <div className="conversations__item-avatar">
                  {otherUser.photoUrl ? (
                    <img src={otherUser.photoUrl} alt={otherUser.username} />
                  ) : (
                    <div className="conversations__item-avatar--placeholder">
                      {otherUser.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="conversations__item-content">
                  <div className="conversations__item-top">
                    <span className="conversations__item-name">{otherUser.username}</span>
                    {lastMsg && (
                      <span className="conversations__item-time">
                        {new Date(lastMsg.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="conversations__item-book">{conv.book.title}</p>
                  {lastMsg && (
                    <p className="conversations__item-preview">
                      {lastMsg.sender.username}: {lastMsg.content.length > 50 ? lastMsg.content.slice(0, 50) + '...' : lastMsg.content}
                    </p>
                  )}
                </div>
                {bookPhoto && (
                  <img src={bookPhoto} alt={conv.book.title} className="conversations__item-book-img" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Conversations;
