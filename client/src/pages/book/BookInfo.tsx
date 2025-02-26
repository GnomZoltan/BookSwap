import React, { useEffect, useState } from 'react';
import './BookInfo.css';
import { Book } from '../../types/Book';
import { getBookById } from '../../api/bookApi';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const BookInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchBook();
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
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Language:</strong> {book.language}</p>
        <p><strong>City:</strong> {book.city}</p>
        <p><strong>Condition:</strong> {book.condition}</p>
        <p><strong>Description:</strong> {book.description}</p>
        <div className="book-genres">
          <strong>Genres:</strong>
          <ul>
            {book.genre.map((g) => (
              <li key={g.genreId}>{g.genre.name}</li>
            ))}
          </ul>
        </div>
        <button className="chat-button">Chat</button>
        <button
          className="profile-button"
          onClick={() => navigate(`/profile/${book.userId}`)}
        >
          View Owner's Profile
        </button>
      </div>
    </div>
  );
};

export default BookInfo;
