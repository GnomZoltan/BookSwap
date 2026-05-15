import React, { useEffect, useState } from 'react';
import { User } from '../../types/User';
import { getMyself, getSomeUser, deleteUser } from '../../api/userApi';
import { useNavigate, useParams } from 'react-router-dom';
import { getSentReviews, getReceivedReviews, deleteReview, createReview } from '../../api/reviewApi';
import { getSentRequests, getReceivedRequests, deleteRequest, approveRequest, declineRequest } from '../../api/requestApi';
import BookCard from '../../components/BookCard/BookCard';
import { getBooksByOwnerId } from '../../api/bookApi';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../api/authenticationApi';
import './Profile.css';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const [sectionContent, setSectionContent] = useState<any[]>([]);
  const [isShowingInactive, setIsShowingInactive] = useState(false);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();

  const isAuthenticated = !!accessToken;
  const loggedUserId = accessToken ? jwtDecode<{ id: string }>(accessToken).id : null;
  const isOwnProfile = isAuthenticated && loggedUserId === userId;
  const loggedUserRole = accessToken ? jwtDecode<{ role: string }>(accessToken).role : null;
  const isAdmin = loggedUserRole === 'ADMIN';

  useEffect(() => {
    const handlePopState = () => navigate('/', { replace: true });
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  const fetchUser = async () => {
    setLoading(true);
    try { const r = isOwnProfile ? await getMyself() : await getSomeUser(userId!); setUser(r.data); }
    catch (error) { console.error('Failed to fetch user:', error); }
    finally { setLoading(false); }
  };

  const handleCreateReview = async () => {
    if (!rating || !comment) { alert('Please provide both a rating and a comment.'); return; }
    try { await createReview({ reviewedUserId: userId!, rating: parseFloat(rating), comment }); alert('Review created successfully.'); setRating(''); setComment(''); setActiveSection(''); }
    catch (error) { console.error('Failed to create review:', error); alert('Failed to create the review.'); }
  };

  const handleSetActiveSection = (section: string) => { if (section === 'create-review') setSectionContent([]); setActiveSection(section); };

  const fetchSectionData = async (section: string) => {
    if (!user?.id) return;
    let fetchFunction;
    switch (section) {
      case 'books': fetchFunction = () => getBooksByOwnerId(user.id); break;
      case 'sent-requests': fetchFunction = () => getSentRequests(user.id); break;
      case 'received-requests': fetchFunction = () => getReceivedRequests(user.id); break;
      case 'sent-reviews': fetchFunction = () => getSentReviews(user.id); break;
      case 'received-reviews': fetchFunction = () => getReceivedReviews(user.id); break;
      default: setSectionContent([]); return;
    }
    try { const r = await fetchFunction(); setSectionContent(r.data); }
    catch (error) { console.error(`Failed to fetch ${section} data:`, error); }
  };

  const handleDelete = async () => {
    if (userId) { try { await deleteUser(userId); alert('User deleted successfully.'); navigate('/'); } catch (error) { console.error('Failed to delete user:', error); alert('Failed to delete the user.'); } }
  };

  const handleLogout = async () => { try { await logout(); setAccessToken(''); } catch {} navigate('/'); };

  useEffect(() => { fetchUser(); }, []);
  useEffect(() => { if (activeSection) fetchSectionData(activeSection); }, [activeSection]);

  const renderSectionContent = () => {
    const handleDeleteReview = async (id: string) => { try { await deleteReview(id); alert('Review deleted.'); setSectionContent((p) => p.filter((r) => r.id !== id)); } catch { alert('Failed to delete review.'); } };
    const handleDeleteRequest = async (id: string) => { try { await deleteRequest(id); alert('Request deleted.'); setSectionContent((p) => p.filter((r) => r.id !== id)); } catch { alert('Failed to delete request.'); } };
    const handleApproveRequest = async (id: string) => { try { await approveRequest(id); alert('Request approved.'); } catch { alert('Failed to approve request.'); } };
    const handleDeclineRequest = async (id: string) => { try { await declineRequest(id); alert('Request declined.'); } catch { alert('Failed to decline request.'); } };

    if (activeSection === 'books') {
      const filtered = sectionContent.filter((b) => isShowingInactive ? b.status === 'SWAPPED' : b.status === 'AVAILABLE');
      return (<>
        <div className="profile__toggle-row">
          <label className="profile__switch"><input type="checkbox" checked={isShowingInactive} onChange={() => setIsShowingInactive((p) => !p)} /><span className="profile__switch-slider" /></label>
          <span className="profile__toggle-label">Показати неактивні книги</span>
        </div>
        <div className="profile__books-grid">
          {filtered.map((book) => (<BookCard key={book.id} id={book.id} title={book.title} author={book.author} city={book.city} photoUrl={book.photos && book.photos.length > 0 ? book.photos[0].photoUrl : undefined} />))}
        </div>
      </>);
    }

    if (activeSection === 'create-review') {
      return (
        <div className="profile__review-form">
          <div className="form-field"><label className="form-field__label">Рейтинг (1-5)</label><input type="number" min="1" max="5" step="0.1" className="form-field__input" value={rating} onChange={(e) => setRating(e.target.value)} /></div>
          <div className="form-field"><label className="form-field__label">Коментар</label><textarea className="form-field__textarea" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} /></div>
          <button onClick={handleCreateReview} className="btn btn--primary">Надіслати відгук</button>
        </div>
      );
    }

    if (!sectionContent || sectionContent.length === 0) return <p className="profile__empty">Немає даних для цього розділу.</p>;

    switch (activeSection) {
      case 'sent-requests':
        return sectionContent.map((req) => (
          <div key={req.id} className="profile__request-card">
            <div className="profile__request-books">
              <div className="profile__request-book">
                <div className="profile__request-cover">
                  {req.senderBookPhoto
                    ? <img src={req.senderBookPhoto} alt={req.senderBookId} />
                    : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
                </div>
                <span className="profile__request-book-label">Ваша книга</span>
                <span className="profile__request-book-title">{req.senderBookId}</span>
              </div>
              <div className="profile__request-arrow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 16L3 12l4-4"/><path d="M3 12h18"/><path d="M17 8l4 4-4 4"/>
                </svg>
              </div>
              <div className="profile__request-book">
                <div className="profile__request-cover">
                  {req.receiverBookPhoto
                    ? <img src={req.receiverBookPhoto} alt={req.receiverBookId} />
                    : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
                </div>
                <span className="profile__request-book-label">Бажана книга</span>
                <span className="profile__request-book-title">{req.receiverBookId}</span>
              </div>
            </div>
            <div className="profile__request-footer">
              <div className="profile__request-meta">
                <span className={`profile__status profile__status--${req.status.toLowerCase()}`}>{req.status}</span>
                <span className="profile__item-date">{new Date(req.createdAt).toLocaleString()}</span>
              </div>
              {((isOwnProfile && req.status === 'PENDING') || isAdmin) && (
                <button className="btn btn--danger btn--sm" onClick={() => handleDeleteRequest(req.id)}>Видалити запит</button>
              )}
            </div>
          </div>
        ));
      case 'received-requests':
        return sectionContent.map((req) => (
          <div key={req.id} className="profile__request-card">
            <div className="profile__request-books">
              <div className="profile__request-book">
                <div className="profile__request-cover">
                  {req.senderBookPhoto
                    ? <img src={req.senderBookPhoto} alt={req.senderBookId} />
                    : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
                </div>
                <span className="profile__request-book-label">Пропонують</span>
                <span className="profile__request-book-title">{req.senderBookId}</span>
              </div>
              <div className="profile__request-arrow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 16L3 12l4-4"/><path d="M3 12h18"/><path d="M17 8l4 4-4 4"/>
                </svg>
              </div>
              <div className="profile__request-book">
                <div className="profile__request-cover">
                  {req.receiverBookPhoto
                    ? <img src={req.receiverBookPhoto} alt={req.receiverBookId} />
                    : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
                </div>
                <span className="profile__request-book-label">Ваша книга</span>
                <span className="profile__request-book-title">{req.receiverBookId}</span>
              </div>
            </div>
            <div className="profile__request-footer">
              <div className="profile__request-meta">
                <span className={`profile__status profile__status--${req.status.toLowerCase()}`}>{req.status}</span>
                <span className="profile__item-date">{new Date(req.createdAt).toLocaleString()}</span>
              </div>
              {isOwnProfile && req.status === 'PENDING' && (
                <div className="profile__item-actions">
                  <button className="btn btn--primary btn--sm" onClick={() => handleApproveRequest(req.id)}>Прийняти</button>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDeclineRequest(req.id)}>Відхилити</button>
                </div>
              )}
            </div>
          </div>
        ));
      case 'sent-reviews':
        return sectionContent.map((rev) => (
          <div key={rev.id} className="profile__item">
            <div className="profile__item-content">
              <p><span className="profile__item-label">Рейтинг:</span> {rev.rating}</p>
              <p><span className="profile__item-label">Коментар:</span> {rev.comment}</p>
              <p className="profile__item-date">{new Date(rev.createdAt).toLocaleString()}</p>
              {(isOwnProfile || isAdmin) && <button className="btn btn--danger btn--sm" onClick={() => handleDeleteReview(rev.id)}>Видалити</button>}
            </div>
          </div>
        ));
      case 'received-reviews':
        return sectionContent.map((rev) => (
          <div key={rev.id} className="profile__item">
            <div className="profile__item-content">
              <p><span className="profile__item-label">Рейтинг:</span> {rev.rating}</p>
              <p><span className="profile__item-label">Коментар:</span> {rev.comment}</p>
              <p className="profile__item-date">{new Date(rev.createdAt).toLocaleString()}</p>
              {isAdmin && <button className="btn btn--danger btn--sm" onClick={() => handleDeleteReview(rev.id)}>Видалити</button>}
            </div>
          </div>
        ));
      default: return <p className="profile__empty">Оберіть розділ.</p>;
    }
  };

  return (
    <div className="profile">
      {loading ? <div className="profile__loading"><p>Завантаження...</p></div> : user ? (<>
        <div className="profile__card">
          <div className="profile__header">
            <img src={user.photoUrl} alt={user.username} className="profile__avatar" />
            <div className="profile__info">
              <h1 className="profile__name">{user.username}</h1>
              <div className="profile__meta"><span>Рейтинг: {user.avgRating.toFixed(1)}</span><span>Приєднався: {new Date(user.createdAt).toLocaleDateString()}</span></div>
              {user.description && <p className="profile__description">{user.description}</p>}
            </div>
            {(isOwnProfile || isAdmin) && (
              <div className="profile__header-actions">
                <button className="btn btn--secondary" onClick={() => navigate('/edit-profile')}>Змінити профіль</button>
                <button className="btn btn--secondary" onClick={handleLogout}>Вийти</button>
                <button className="btn btn--danger" onClick={handleDelete}>Видалити профіль</button>
              </div>
            )}
          </div>
        </div>
        <div className="profile__tabs">
          <button className={`profile__tab ${activeSection === 'books' ? 'profile__tab--active' : ''}`} onClick={() => setActiveSection('books')}>{isOwnProfile ? 'Мої книги' : 'Книги'}</button>
          {isAuthenticated && !isOwnProfile && !isAdmin && <button className={`profile__tab ${activeSection === 'create-review' ? 'profile__tab--active' : ''}`} onClick={() => handleSetActiveSection('create-review')}>Відгук</button>}
          {!isAuthenticated && !isOwnProfile && <button className={`profile__tab ${activeSection === 'login-cta' ? 'profile__tab--active' : ''}`} onClick={() => setActiveSection('login-cta')}>Відгук</button>}
          {(isOwnProfile || isAdmin) && (<>
            <button className={`profile__tab ${activeSection === 'sent-requests' ? 'profile__tab--active' : ''}`} onClick={() => setActiveSection('sent-requests')}>Надіслані запити</button>
            <button className={`profile__tab ${activeSection === 'received-requests' ? 'profile__tab--active' : ''}`} onClick={() => setActiveSection('received-requests')}>Отримані запити</button>
            <button className={`profile__tab ${activeSection === 'sent-reviews' ? 'profile__tab--active' : ''}`} onClick={() => setActiveSection('sent-reviews')}>Надіслані відгуки</button>
            <button className={`profile__tab ${activeSection === 'received-reviews' ? 'profile__tab--active' : ''}`} onClick={() => setActiveSection('received-reviews')}>Отримані відгуки</button>
          </>)}
        </div>
        <div className="profile__content">
          {activeSection === 'login-cta' ? (
            <div className="profile__login-cta">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p className="profile__login-cta-text">Увійдіть, щоб залишити відгук</p>
              <button className="btn btn--primary" onClick={() => navigate('/signin')}>Увійти</button>
            </div>
          ) : activeSection ? renderSectionContent() : <p className="profile__empty">Оберіть розділ вище</p>}
        </div>
      </>) : <div className="profile__loading"><p>Користувача не знайдено</p></div>}
    </div>
  );
};

export default Profile;
