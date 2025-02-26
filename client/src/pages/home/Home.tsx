import React, { useEffect, useState } from 'react';
import './Home.css';
import { Book } from '../../types/Book';
import { getAllBooks } from '../../api/bookApi';
import { useNavigate } from 'react-router-dom';
import BookCard from '../../components/bookCard/BookCard';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../content/AuthContext';

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const loggedUserId = accessToken ? jwtDecode<{ id: string }>(accessToken).id : null;  

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await getAllBooks();
      const data = response.data;
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">BookSwap</div>
        <div className="header-actions">
          <button className="custom-button my-chats" onClick={() => navigate('/my-chats')}>
            ✉
          </button>
          <button className="custom-button my-liked" onClick={() => navigate('/wishlist')}>
            ♡
          </button>
          <button className="custom-button profile" onClick={() => navigate(`/profile/${loggedUserId}`)}>
            👤
          </button>
          <button className="custom-button add-book" onClick={() => navigate('/add-book')}>
            +
          </button>
        </div>
      </header>
      <div className="search-container">
        <input className="search-bar" type="text" placeholder="Search for books..." />
      </div>
      <main className="books-container">
        {loading ? (
          <p>Loading books...</p>
        ) : books.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              city={book.city}
              photoUrl={book.photos[0]?.photoUrl}
            />
          ))
        ) : (
          <p>No books available</p>
        )}
      </main>
    </div>
  );
};

export default Home;
