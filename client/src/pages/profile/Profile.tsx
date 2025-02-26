import React, { useEffect, useState } from 'react';
import './Profile.css';
import { User } from '../../types/User';
import { getMyself, getSomeUser } from '../../api/userApi';
import { useNavigate, useParams } from 'react-router-dom';
import LogoutButton from '../loginAndLogout/LogoutButton';
import { getSentReviews, getReceivedReviews } from '../../api/reviewApi';
import { getSentRequests, getReceivedRequests } from '../../api/requestApi';
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
  const navigate = useNavigate();
  const { accessToken } = useAuth(); 

  const loggedUserId = accessToken ? jwtDecode<{ id: string }>(accessToken).id : null;
  const isOwnProfile = loggedUserId === userId

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

  const fetchSectionData = async (section: string) => {
    setSectionContent([]); 
  
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
        return;
    }
  
    try {
      const response = await fetchFunction();
      setSectionContent(response.data);
    } catch (error) {
      console.error(`Failed to fetch ${section} data:`, error);
    }
  };
  
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (activeSection) {
      fetchSectionData(activeSection);
    }
  }, [activeSection]);

  const renderSectionContent = () => {
    if (!sectionContent || sectionContent.length === 0) {
      return <p>No content available for this section.</p>;
    }
  
    switch (activeSection) {
      case 'books':
      return (
        <div className="profile-books-container">
          {sectionContent.map((book) => (
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
      );
      case 'sent-requests':
        return sectionContent.map((request) => (
          <div key={request.id} className="profile-item">
            <p><strong>To:</strong> {request.receiverId}</p>
            <p><strong>Your Book:</strong> {request.senderBookId}</p>
            <p><strong>Requested Book:</strong> {request.receiverBookId}</p>
            <p><strong>Status:</strong> {request.status}</p>
            <p><strong>Requested At:</strong> {new Date(request.createdAt).toLocaleString()}</p>
          </div>
        ));
      case 'received-requests':
        return sectionContent.map((request) => (
          <div key={request.id} className="profile-item">
            <p><strong>From:</strong> {request.senderId}</p>
            <p><strong>Sender's Book:</strong> {request.senderBookId}</p>
            <p><strong>Your Book:</strong> {request.receiverBookId}</p>
            <p><strong>Status:</strong> {request.status}</p>
            <p><strong>Received At:</strong> {new Date(request.createdAt).toLocaleString()}</p>
          </div>
        ));
      case 'sent-reviews':
        return sectionContent.map((review) => (
          <div key={review.id} className="profile-item">
            <p><strong>To:</strong> {review.reviewedUserId}</p>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p><strong>Comment:</strong> {review.comment}</p>
            <p><strong>Reviewed At:</strong> {new Date(review.createdAt).toLocaleString()}</p>
          </div>
        ));
      case 'received-reviews':
        return sectionContent.map((review) => (
          <div key={review.id} className="profile-item">
            <p><strong>From:</strong> {review.reviewerId}</p>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p><strong>Comment:</strong> {review.comment}</p>
            <p><strong>Received At:</strong> {new Date(review.createdAt).toLocaleString()}</p>
          </div>
        ));
      default:
        return <p>Select a section to view its content.</p>;
    }
  };
  

  return (
    <div className="profile-container">
      {loading ? (
        <p>Loading profile...</p>
      ) : user ? (
        <div className="profile-card">
          <div className="profile-header">
            <img src={user.photoUrl} alt={user.username} className="profile-photo" />
            <div className="profile-header-info">
              <h1 className="profile-username">{user.username}</h1>
              <p className="profile-created-at">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              <p className="profile-rating">Rating: {user.avgRating.toFixed(1)}</p>
            </div>
            {isOwnProfile && (
              <div className="profile-footer">
                <button className="edit-profile-btn" onClick={() => navigate(`/edit-profile/${user.id}`)}>
                  Edit Profile
                </button>
                <LogoutButton />
              </div>
            )}
          </div>
          <p className="profile-description">{user.description || 'No description provided.'}</p>
          <div className="profile-actions-row">
            <button className="profile-btn" onClick={() => setActiveSection('books')}>
              {isOwnProfile ? 'My Books' : 'User Books'}
            </button>
            {isOwnProfile && (
              <>
                <button className="profile-btn" onClick={() => setActiveSection('sent-requests')}>
                  Sent Requests
                </button>
                <button className="profile-btn" onClick={() => setActiveSection('received-requests')}>
                  Received Requests
                </button>
                <button className="profile-btn" onClick={() => setActiveSection('sent-reviews')}>
                  Sent Reviews
                </button>
                <button className="profile-btn" onClick={() => setActiveSection('received-reviews')}>
                  Received Reviews
                </button>
              </>
            )}
          </div>
          <div className="profile-section-content">
            {sectionContent.length > 0 ? renderSectionContent() : <p>No content available for this section.</p>}
          </div>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default Profile;