import React, { useEffect, useState } from 'react';
import './BookInfo.css';
import { Book } from '../../types/Book';
import { getBookById, deleteBook, getBooksByOwnerId } from '../../api/bookApi';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../content/AuthContext';
import BookCard from '../../components/bookCard/BookCard';
import { createRequest } from '../../api/requestApi';
import { getMyself } from '../../api/userApi';

const BookInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [sectionContent, setSectionContent] = useState<any[]>([]);
  const navigate = useNavigate();
  const { accessToken } = useAuth(); 
  const [userPhoto, setUserPhoto] = useState('');
  
  const loggedUserId = accessToken ? jwtDecode<{ id: string }>(accessToken).id : null;
  const loggedUserRole = accessToken ? jwtDecode<{ role: string }>(accessToken).role : null;
  const isAdmin = loggedUserRole === 'ADMIN'

  const fetchBook = async () => {
    setLoading(true);
    try {
      if (id) {
        const response = await getBookById(id);
        const data: Book = response.data;
        setBook(data);
      }
    } catch (error) {
      console.error('Failed to fetch book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteBook(id);
        alert('Book deleted successfully.');
        navigate('/home');
      } catch (error) {
        console.error('Failed to delete book:', error);
        alert('Failed to delete the book. Please try again later.');
      }
    }
  };

  const handleCreateRequest = async (senderBookId: string) => {
    if (id) {
      try {
        const receiverId = book?.userId!;
        const receiverBookId = id;
        await createRequest({receiverId, receiverBookId, senderBookId});
        alert('Request sent successfully.');
        navigate('/home');
      } catch (error) {
        console.error('Failed to delete book:', error);
        alert('Failed to send the request. Please try again later.');
      }
    }
  };

  const fetchBooksForExchange = async () => {
    try {
      const response = await getBooksByOwnerId(loggedUserId!);
      setSectionContent(response.data);
    } catch (error) {
      console.error(`Failed to fetch data:`, error);
    }
  };

  const renderSectionContent = () => {
    if (!sectionContent || sectionContent.length === 0) {
      return <p>No content available for this section.</p>;
    }
  
    return (
      <div className="profile-books-container">
        {sectionContent.map((book) => (
          <div key={book.id} className="book-card-container">
            {/* Wrap BookCard with a clickable div or button */}
            <div onClick={() => handleCreateRequest(book.id)} className="book-card-clickable">
              <BookCard
                id={book.id}
                title={book.title}
                author={book.author}
                city={book.city}
                photoUrl={book.photos && book.photos.length > 0 ? book.photos[0].photoUrl : null}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const fetchPhoto = async () => {
    try {
      const response = await getMyself();
      const data = response.data.photoUrl;
      setUserPhoto(data);
    } catch (error) {
      console.error('Failed to fetch photo:', error);
    }
  };
  
  useEffect(() => {
    fetchBook();
    fetchPhoto();
  }, [id]);

  const handlePrevPhoto = () => {
    if (book) {
      setCurrentPhotoIndex((prevIndex) => (prevIndex === 0 ? book.photos.length - 1 : prevIndex - 1));
    }
  };

  const handleNextPhoto = () => {
    if (book) {
      setCurrentPhotoIndex((prevIndex) => (prevIndex === book.photos.length - 1 ? 0 : prevIndex + 1));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!book) {
    return <p>Book not found</p>;
  }

  return (
    <div className="home-container">
      <header className="home-header">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
            BookSwap
          </div>
          <div className="header-actions">
            <button className="custom-button my-liked" onClick={() => navigate('/wishlist')}>
              ♡
            </button>
            <button className="custom-button add-book" onClick={() => navigate('/add-book')}>
              +
            </button>
            <button
              className="custom-button profile"
              onClick={() => navigate(`/profile/${loggedUserId}`)}
            >
              <img src={userPhoto} alt="profile" />
            </button>
          </div>
        </header>
      <div className="book-info-container">
        {/* Photo Slider */}
        <div className="book-photos-slider">
          {book.photos.length > 0 && (
            <>
              <button className="slider-arrow slider-arrow-left" onClick={handlePrevPhoto}>
                &#8592;
              </button>
              <img
                src={book.photos[currentPhotoIndex].photoUrl}
                alt={`Photo ${currentPhotoIndex + 1}`}
                className="slider-photo"
              />
              <button className="slider-arrow slider-arrow-right" onClick={handleNextPhoto}>
                &#8594;
              </button>
            </>
          )}
        </div>

        {/* Book Details */}
        <div className="book-details-container">
          <h1 className="book-title">{book.title}</h1>
          <p><strong>Автор:</strong> {book.author}</p>
          <p><strong>Мова:</strong> {book.language}</p>
          <p><strong>Місто:</strong> {book.city}</p>
          <p><strong>Стан:</strong> {book.condition}</p>
          <p><strong>Опис:</strong> {book.description}</p>
          <div className="book-genres">
            <strong>Жанри:</strong>
            <ul>
              {book.genre.map((g) => (
                <li key={g.genreId}>{g.genre.name}</li>
              ))}
            </ul>
          </div>
          {/* <button className="chat-button">Chat</button> */}
          { loggedUserId !== book.userId &&
          <button className="delete-button" onClick={fetchBooksForExchange}>
            Обмін
          </button> }
          <button
            className="delete-button"
            onClick={() => navigate(`/profile/${book.userId}`)}
          >
            Профіль власника
          </button>
          { ((loggedUserId === book.userId) || isAdmin) &&
          <button className="delete-button" onClick={() => navigate(`/add-book/${book.id}`)}>
            Змінити деталі
          </button> }
          { ((loggedUserId === book.userId) || isAdmin) &&
          <button className="delete-button" onClick={handleDelete}>
            Видалити книгу
          </button> }
        </div>
        {sectionContent.length > 0 && (
          <div className="profile-section-content">
            <h2>Ваші книги для обміну</h2>
            <div className="profile-books-scroll">
              {renderSectionContent()}
          </div>
  </div>
)}

      </div>
    </div>
  );
};

export default BookInfo;
