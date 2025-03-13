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

  const loggedUserId = accessToken ? jwtDecode<{ id: string }>(accessToken).id : null;
  const isOwnProfile = loggedUserId === userId
  const loggedUserRole = accessToken ? jwtDecode<{ role: string }>(accessToken).role : null;
  const isAdmin = loggedUserRole === 'ADMIN'

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
          <span className="toggle-label">{isShowingInactive ? 'Show Active Books' : 'Show Inactive Books'}</span>
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
                  <strong>Rating:</strong>
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
                  <strong>Comment:</strong>
                  <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                  />
              </label>
              <button onClick={handleCreateReview} className="send-review-btn">
                  Send Review
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
              <strong>Rating:</strong>
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
              <strong>Comment:</strong>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>
            <button onClick={handleCreateReview} className="send-review-btn">
              Send Review
            </button>
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
            { ((isOwnProfile && request.status === 'PENDING') || isAdmin) && 
            <button className="delete-review-btn" onClick={() => handleDeleteRequest(request.id)}>
              Delete Request
            </button> }
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
            { (isOwnProfile && request.status === 'PENDING') && 
            <button className="delete-review-btn" onClick={() => handleApproveRequest(request.id)}>
              Approve Request
            </button> }
            { (isOwnProfile && request.status === 'PENDING') && 
            <button className="delete-review-btn" onClick={() => handleDeclineRequest(request.id)}>
              Decline Request
            </button> }
          </div>
        ));
      case 'sent-reviews':
        return sectionContent.map((review) => (
          <div key={review.id} className="profile-item">
            <p><strong>To:</strong> {review.reviewedUserId}</p>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p><strong>Comment:</strong> {review.comment}</p>
            <p><strong>Reviewed At:</strong> {new Date(review.createdAt).toLocaleString()}</p>
            { (isOwnProfile || isAdmin) && 
            <button className="delete-review-btn" onClick={() => handleDeleteReview(review.id)}>
              Delete Review
            </button> }
          </div>
        ));
      case 'received-reviews':
        return sectionContent.map((review) => (
          <div key={review.id} className="profile-item">
            <p><strong>From:</strong> {review.reviewerId}</p>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p><strong>Comment:</strong> {review.comment}</p>
            <p><strong>Received At:</strong> {new Date(review.createdAt).toLocaleString()}</p>
            { isAdmin &&
            <button className="delete-review-btn" onClick={() => handleDeleteReview(review.id)}>
              Delete Review
            </button> }
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
            {(isOwnProfile || isAdmin ) && (
              <div className="profile-footer">
                <button className="edit-profile-btn" onClick={() => navigate("/edit-profile")}>
                  Edit Profile
                </button>
                <LogoutButton />
                <button className="delete-profile-btn" onClick={handleDelete}>
                  Delete Profile
                </button>
              </div>
            )}
          </div>
          <p className="profile-description">{user.description || 'No description provided.'}</p>
          <div className="profile-actions-row">
            <button className="profile-btn" onClick={() => setActiveSection('books')}>
              {isOwnProfile ? 'My Books' : 'User Books'}
            </button>
            { (!isOwnProfile && !isAdmin ) && 
              <button className="profile-btn" onClick={() => handleSetActiveSection('create-review')}>
                Create Review
              </button>
            }
            {(isOwnProfile || isAdmin) && (
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