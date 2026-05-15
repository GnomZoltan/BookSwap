import React, { useEffect, useState } from 'react';
import { Book } from '../../types/Book';
import { getBookById, deleteBook, getBooksByOwnerId } from '../../api/bookApi';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
import BookCard from '../../components/BookCard/BookCard';
import { createRequest } from '../../api/requestApi';
import './BookInfo.css';

const BookInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [sectionContent, setSectionContent] = useState<any[]>([]);
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const isAuthenticated = !!accessToken;
  const loggedUserId = accessToken ? jwtDecode<{ id: string }>(accessToken).id : null;
  const loggedUserRole = accessToken ? jwtDecode<{ role: string }>(accessToken).role : null;
  const isAdmin = loggedUserRole === 'ADMIN';

  const fetchBook = async () => {
    setLoading(true);
    try {
      if (id) {
        const response = await getBookById(id);
        setBook(response.data);
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
        navigate('/');
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
        await createRequest({ receiverId, receiverBookId, senderBookId });
        alert('Request sent successfully.');
        navigate('/');
      } catch (error) {
        console.error('Failed to send request:', error);
        alert('Failed to send the request. Please try again later.');
      }
    }
  };

  const fetchBooksForExchange = async () => {
    try {
      const response = await getBooksByOwnerId(loggedUserId!);
      setSectionContent(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handlePrevPhoto = () => {
    if (book) {
      setCurrentPhotoIndex((prev) => (prev === 0 ? book.photos.length - 1 : prev - 1));
    }
  };

  const handleNextPhoto = () => {
    if (book) {
      setCurrentPhotoIndex((prev) => (prev === book.photos.length - 1 ? 0 : prev + 1));
    }
  };

  if (loading) {
    return (
      <div className="book-info__loading">
        <p>Завантаження...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-info__loading">
        <p>Книгу не знайдено</p>
      </div>
    );
  }

  return (
    <div className="book-info">
      <div className="book-info__main">
        {/* Photo slider */}
        <div className="book-info__slider">
          {book.photos.length > 0 && (
            <>
              {book.photos.length > 1 && (
                <button className="book-info__arrow book-info__arrow--left" onClick={handlePrevPhoto}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
              )}
              <img
                src={book.photos[currentPhotoIndex].photoUrl}
                alt={`${book.title} photo ${currentPhotoIndex + 1}`}
                className="book-info__photo"
              />
              {book.photos.length > 1 && (
                <button className="book-info__arrow book-info__arrow--right" onClick={handleNextPhoto}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              )}
              {book.photos.length > 1 && (
                <div className="book-info__dots">
                  {book.photos.map((_, i) => (
                    <span
                      key={i}
                      className={`book-info__dot ${i === currentPhotoIndex ? 'book-info__dot--active' : ''}`}
                      onClick={() => setCurrentPhotoIndex(i)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Details */}
        <div className="book-info__details">
          <h1 className="book-info__title">{book.title}</h1>

          <dl className="book-info__meta">
            <div className="book-info__meta-row">
              <dt>Автор</dt>
              <dd>{book.author}</dd>
            </div>
            <div className="book-info__meta-row">
              <dt>Мова</dt>
              <dd>{book.language}</dd>
            </div>
            <div className="book-info__meta-row">
              <dt>Місто</dt>
              <dd>{book.city}</dd>
            </div>
            <div className="book-info__meta-row">
              <dt>Стан</dt>
              <dd>{book.condition}</dd>
            </div>
          </dl>

          {book.genre.length > 0 && (
            <div className="book-info__genres">
              {book.genre.map((g) => (
                <span key={g.genreId} className="book-info__genre-tag">
                  {g.genre.name}
                </span>
              ))}
            </div>
          )}

          {book.description && (
            <p className="book-info__description">{book.description}</p>
          )}

          <div className="book-info__actions">
            {loggedUserId !== book.userId && (
              book.forFree ? (
                isAuthenticated ? (
                  <button className="btn btn--primary" onClick={() => navigate(`/chat/${book.id}/${book.userId}`)}>
                    Отримати книгу
                  </button>
                ) : (
                  <div className="book-info__swap-disabled-wrapper">
                    <button className="btn btn--primary btn--disabled" disabled>
                      Отримати книгу
                    </button>
                    <span className="book-info__swap-tooltip">Увійдіть, щоб отримати книгу</span>
                  </div>
                )
              ) : (
                isAuthenticated ? (
                  <button className="btn btn--primary" onClick={fetchBooksForExchange}>
                    Обмін
                  </button>
                ) : (
                  <div className="book-info__swap-disabled-wrapper">
                    <button className="btn btn--primary btn--disabled" disabled>
                      Обмін
                    </button>
                    <span className="book-info__swap-tooltip">Увійдіть, щоб обмінятись</span>
                  </div>
                )
              )
            )}
            {loggedUserId !== book.userId && isAuthenticated && (
              <button
                className="btn btn--secondary"
                onClick={() => navigate(`/chat/${book.id}/${book.userId}`)}
              >
                Написати власнику
              </button>
            )}
            <button
              className="btn btn--secondary"
              onClick={() => navigate(`/profile/${book.userId}`)}
            >
              Профіль власника
            </button>
            {((loggedUserId === book.userId) || isAdmin) && (
              <button className="btn btn--secondary" onClick={() => navigate(`/add-book/${book.id}`)}>
                Змінити деталі
              </button>
            )}
            {((loggedUserId === book.userId) || isAdmin) && (
              <button className="btn btn--danger" onClick={handleDelete}>
                Видалити книгу
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exchange books section */}
      {sectionContent.length > 0 && (
        <div className="book-info__exchange">
          <h2 className="book-info__exchange-title">Ваші книги для обміну</h2>
          <p className="book-info__exchange-hint">Оберіть книгу, яку хочете запропонувати</p>
          <div className="book-info__exchange-grid">
            {sectionContent.map((b) => (
              <div key={b.id} onClick={() => handleCreateRequest(b.id)} className="book-info__exchange-item">
                <BookCard
                  id={b.id}
                  title={b.title}
                  author={b.author}
                  city={b.city}
                  photoUrl={b.photos && b.photos.length > 0 ? b.photos[0].photoUrl : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookInfo;
