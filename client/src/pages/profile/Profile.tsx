import React, { useEffect, useState } from 'react';
import './Profile.css';
import { User } from '../../types/User';
import { getMyself, getSomeUser, deleteUser } from '../../api/userApi';
import { useNavigate, useParams } from 'react-router-dom';
import LogoutButton from '../loginAndLogout/LogoutButton';
import { getSentReviews, getReceivedReviews, deleteReview, createReview } from '../../api/reviewApi';
import { getSentRequests, getReceivedRequests, deleteRequest, approveRequest, declineRequest } from '../../api/requestApi';
import BookCard from '../../components/bookCard/BookCard';
import { getBooksByOwnerId } from '../../api/bookApi';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../content/AuthContext';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const [sectionContent, setSectionContent] = useState<any[]>([]);
  const [isShowingInactive, setIsShowingInactive] = useState<boolean>(false);
  const [rating, setRating] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const navigate = useNavigate();
  const { accessToken } = useAuth(); 
  const [userPhoto, setUserPhoto] = useState('');

  const loggedUserId = accessToken ? jwtDecode<{ id: string }>(accessToken).id : null;
  const isOwnProfile = loggedUserId === userId
  const loggedUserRole = accessToken ? jwtDecode<{ role: string }>(accessToken).role : null;
  const isAdmin = loggedUserRole === 'ADMIN'

  useEffect(() => {
    // Функція для обробки натискання "Назад"
    const handlePopState = () => {
      navigate('/home', { replace: true });
    };

    // Додаємо слухач на подію popstate
    window.addEventListener('popstate', handlePopState);

    // Прибираємо слухач при демонтажі компонента
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const fetchPhoto = async () => {
    try {
      const response = await getMyself();
      const data = response.data.photoUrl;
      setUserPhoto(data);
    } catch (error) {
      console.error('Failed to fetch photo:', error);
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = isOwnProfile ? await getMyself() : await getSomeUser(userId!);
      const data: User = response.data;
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async () => {
    if (!rating || !comment) {
      alert('Please provide both a rating and a comment.');
      return;
    }

    try {
      await createReview({ reviewedUserId: userId!, rating: parseFloat(rating), comment });
      alert('Review created successfully.');
      setRating('');
      setComment('');
      setActiveSection('');
    } catch (error) {
      console.error('Failed to create review:', error);
      alert('Failed to create the review. Please try again later.');
    }
  };

  const handleSetActiveSection = (section: string) => {
    if (section === 'create-review') {
        setSectionContent([]);
    }
    setActiveSection(section);
  };

  const fetchSectionData = async (section: string) => {
    if (!user?.id) {
        console.error("User ID is required to fetch data.");
        return;
    }

    let fetchFunction;
    switch (section) {
        case 'books':
            fetchFunction = () => getBooksByOwnerId(user.id);
            break;
        case 'sent-requests':
            fetchFunction = () => getSentRequests(user.id);
            break;
        case 'received-requests':
            fetchFunction = () => getReceivedRequests(user.id);
            break;
        case 'sent-reviews':
            fetchFunction = () => getSentReviews(user.id);
            break;
        case 'received-reviews':
            fetchFunction = () => getReceivedReviews(user.id);
            break;
        default:
            setSectionContent([]);
            return;
    }

    try {
        const response = await fetchFunction();
        setSectionContent(response.data);
    } catch (error) {
        console.error(`Failed to fetch ${section} data:`, error);
    }
  };

  const handleDelete = async () => {
      if (userId) {
        try {
          await deleteUser(userId);
          alert('User deleted successfully.');
          navigate('/');
        } catch (error) {
          console.error('Failed to delete user:', error);
          alert('Failed to delete the user. Please try again later.');
        }
      }
    };
  
  useEffect(() => {
    fetchUser();
    fetchPhoto();
  }, []);

  useEffect(() => {
    if (activeSection) {
      fetchSectionData(activeSection);
    }
  }, [activeSection]);

  const renderSectionContent = () => {
    const handleDeleteReview = async (reviewId: string) => {
      try {
        await deleteReview(reviewId);   
        alert('Review deleted successfully.');
        setSectionContent((prevContent) => prevContent.filter((review) => review.id !== reviewId));
      } catch (error) {
        console.error('Failed to delete review:', error);
        alert('Failed to delete the review. Please try again later.');
      }
    };

    const handleDeleteRequest = async (requestId: string) => {
      try {
        await deleteRequest(requestId); 
        alert('Request deleted successfully.');
        setSectionContent((prevContent) => prevContent.filter((request) => request.id !== requestId));
      } catch (error) {
        console.error('Failed to delete request:', error);
        alert('Failed to delete the request. Please try again later.');
      }
    };

    const handleApproveRequest = async (requestId: string) => {
      try {
        await approveRequest(requestId); 
        alert('Request deleted successfully.');
        //setSectionContent((prevContent) => prevContent.filter((request) => request.id !== requestId));
      } catch (error) {
        console.error('Failed to delete request:', error);
        alert('Failed to delete the request. Please try again later.');
      }
    };

    const handleDeclineRequest = async (requestId: string) => {
      try {
        await declineRequest(requestId); 
        alert('Request deleted successfully.');
        //setSectionContent((prevContent) => prevContent.filter((request) => request.id !== requestId));
      } catch (error) {
        console.error('Failed to delete request:', error);
        alert('Failed to delete the request. Please try again later.');
      }
    };

    const filteredBooks = sectionContent.filter((book) => {
      if (isShowingInactive) return book.status === 'SWAPPED';
      return book.status === 'AVAILABLE';
    });

    if (activeSection === 'books') {
      return (
        <>
        <div className="books-toggle-container">
          <label className="switch">
            <input
              type="checkbox"
              checked={isShowingInactive}
              onChange={() => setIsShowingInactive((prev) => !prev)}
            />
            <span className="slider round"></span>
          </label>
          <span className="toggle-label">Показати неактивні книги</span>
        </div>
        <div className="profile-books-container">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              city={book.city}
              photoUrl={book.photos && book.photos.length > 0 ? book.photos[0].photoUrl : null}
            />
          ))}
        </div>
        </>
      );
    }

    if (activeSection === 'create-review') {
      return (
          <div className="create-review-section">
              <label>
                  <strong>Рейтинг:</strong>
                  <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                  />
              </label>
              <label>
                  <strong>Коментар:</strong>
                  <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                  />
              </label>
              <button onClick={handleCreateReview} className="send-review-btn">
                  Надіслати відгук
              </button>
          </div>
      );
    }

    if (!sectionContent || sectionContent.length === 0) {
        return <p>No content available for this section.</p>;
    }
  
    switch (activeSection) {
      case 'create-review':
        return (
          <div className="create-review-section">
            <label>
              <strong>Рейтинг:</strong>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </label>
            <label>
              <strong>Коментар:</strong>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>
            <button onClick={handleCreateReview} className="logout-btn">
              Надіслати відгук
            </button>
          </div>
        );        
      case 'sent-requests':
        return sectionContent.map((request) => (
          <div key={request.id} className="profile-item">
            <img src={request.senderBookPhoto} alt="Sender Book" />
            <div className="text-content">
              <p><strong>Кому:</strong> {request.receiverId}</p>
              <p><strong>Ваша книга:</strong> {request.senderBookId}</p>
              <p><strong>Бажана книга:</strong> {request.receiverBookId}</p>
              <p><strong>Статус:</strong> {request.status}</p>
              <p><strong>Запрошено:</strong> {new Date(request.createdAt).toLocaleString()}</p>
              {((isOwnProfile && request.status === 'PENDING') || isAdmin) && (
                <button
                  className="delete-review-btn"
                  onClick={() => handleDeleteRequest(request.id)}
                >
                  Видалити запит
                </button>
              )}
            </div>
            <img src={request.receiverBookPhoto} alt="Receiver Book" />
          </div>
        ));        
      case 'received-requests':
        return sectionContent.map((request) => (
          <div key={request.id} className="profile-item">
            <img src={request.senderBookPhoto} alt="Sender Book" />
            <div className="text-content">
              <p><strong>Від:</strong> {request.senderId}</p>
              <p><strong>Запропонована книга:</strong> {request.senderBookId}</p>
              <p><strong>Ваша книга:</strong> {request.receiverBookId}</p>
              <p><strong>Статус:</strong> {request.status}</p>
              <p><strong>Отримано:</strong> {new Date(request.createdAt).toLocaleString()}</p>
              { (isOwnProfile && request.status === 'PENDING') && 
              <button className="delete-review-btn" onClick={() => handleApproveRequest(request.id)}>
                Прийняти запит
              </button> }
              { (isOwnProfile && request.status === 'PENDING') && 
              <button className="delete-review-btn" onClick={() => handleDeclineRequest(request.id)}>
                Відхилити запит
              </button> }
            </div>
            <img src={request.receiverBookPhoto} alt="Receiver Book" />
          </div>
        ));
      case 'sent-reviews':
        return sectionContent.map((review) => (
          <div key={review.id} className="profile-item">
            <p><strong>Кому:</strong> {review.reviewedUserId}</p>
            <p><strong>Рейтинг:</strong> {review.rating}</p>
            <p><strong>Коментар:</strong> {review.comment}</p>
            <p><strong>Оцінено:</strong> {new Date(review.createdAt).toLocaleString()}</p>
            { (isOwnProfile || isAdmin) && 
            <button className="delete-review-btn" onClick={() => handleDeleteReview(review.id)}>
              Видалити відгук
            </button> }
          </div>
        ));
      case 'received-reviews':
        return sectionContent.map((review) => (
          <div key={review.id} className="profile-item">
            <p><strong>Від:</strong> {review.reviewerId}</p>
            <p><strong>Рейтинг:</strong> {review.rating}</p>
            <p><strong>Коментар:</strong> {review.comment}</p>
            <p><strong>Отримано:</strong> {new Date(review.createdAt).toLocaleString()}</p>
            { isAdmin &&
            <button className="delete-review-btn" onClick={() => handleDeleteReview(review.id)}>
              Видалити відгук
            </button> }
          </div>
        ));
      default:
        return <p>Select a section to view its content.</p>;
    }
  };
  
  return (
    <div className="profile-container">
      <header className="home-header">
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
          BookSwap
        </div>
        <div className="header-actions">
          {/* <button className="custom-button my-chats" onClick={() => navigate('/my-chats')}>
            ✉
          </button> */}
          <button className="custom-button my-liked" onClick={() => navigate('/wishlist')}>
            ♡
          </button>
          <button className="custom-button add-book" onClick={() => navigate('/add-book')}>
            +
          </button>
          <button className="custom-button profile" onClick={() => navigate(`/profile/${loggedUserId}`)}>
            <img src={userPhoto} alt="profile" />
          </button>
        </div>
      </header>
      {loading ? (
        <p>Loading profile...</p>
      ) : user ? (
        <div className="profile-card">
          <div className="profile-header">
            <img src={user.photoUrl} alt={user.username} className="profile-photo" />
            <div className="profile-header-info">
              <h1 className="profile-username">{user.username}</h1>
              <p className="profile-created-at">Приєднався: {new Date(user.createdAt).toLocaleDateString()}</p>
              <p className="profile-rating">Рейтинг: {user.avgRating.toFixed(1)}</p>
            </div>
            {(isOwnProfile || isAdmin ) && (
              <div className="profile-footer">
                <button className="edit-profile-btn" onClick={() => navigate("/edit-profile")}>
                  Змінити профіль
                </button>
                <LogoutButton />
                <button className="delete-profile-btn" onClick={handleDelete}>
                  Видалити профіль
                </button>
              </div>
            )}
          </div>
          <p className="profile-description">{user.description || 'No description provided.'}</p>
          <div className="profile-actions-row">
            <button className="profile-btn" onClick={() => setActiveSection('books')}>
              {isOwnProfile ? 'Мої книги' : 'Книги користувача'}
            </button>
            { (!isOwnProfile && !isAdmin ) && 
              <button className="profile-btn" onClick={() => handleSetActiveSection('create-review')}>
                Створити відгук
              </button>
            }
            {(isOwnProfile || isAdmin) && (
              <>
                <button className="profile-btn" onClick={() => setActiveSection('sent-requests')}>
                  Надіслані запити
                </button>
                <button className="profile-btn" onClick={() => setActiveSection('received-requests')}>
                  Отримані запити
                </button>
                <button className="profile-btn" onClick={() => setActiveSection('sent-reviews')}>
                  Надіслані відгуки
                </button>
                <button className="profile-btn" onClick={() => setActiveSection('received-reviews')}>
                  Отримані відгуки
                </button>
              </>
            )}
          </div>
          <div className="profile-section-content">
            {activeSection === 'create-review'
              ? renderSectionContent() 
              : (sectionContent.length > 0 
                ? renderSectionContent() 
                : <p>No content available for this section.</p>)}
          </div>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default Profile;