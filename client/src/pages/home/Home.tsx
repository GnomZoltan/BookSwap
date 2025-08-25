import React, { useEffect, useState } from 'react';
import './Home.css';
import { Book } from '../../types/Book';
import { getAllAvailableBooks, searchBooks, searchBooksByGenres } from '../../api/bookApi';
import { getAllGenres } from '../../api/genreApi';
import { getMyself } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
import BookCard from '../../components/bookCard/BookCard';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../content/AuthContext';

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]); // List of genres
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set()); // Selected genres as a set
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [userPhoto, setUserPhoto] = useState('')

  const loggedUserId = accessToken ? jwtDecode<{ id: string }>(accessToken).id : null;

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await getAllAvailableBooks();
      const data = response.data;
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhoto = async () => {
    setLoading(true);
    try {
      const response = await getMyself();
      const data = response.data.photoUrl;
      setUserPhoto(data);
    } catch (error) {
      console.error('Failed to fetch photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await getAllGenres();
      if (response.data && Array.isArray(response.data)) {
        const genreNames = response.data.map((genre: { name: string }) => genre.name);
        setGenres(genreNames);
      } else {
        console.warn('No genres available or response format is incorrect.');
        setGenres([]);
      }
    } catch (error) {
      console.error('Failed to fetch genres:', error);
      setGenres([]);
    }
  };

  const handleSearchInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query === '') {
      fetchBooks();
      return;
    }

    setLoading(true);
    try {
      const response = await searchBooks(query);
      const data = response.data;
      setBooks(data);
    } catch (error) {
      console.error('Failed to search books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreToggle = (genre: string) => {
    const updatedGenres = new Set(selectedGenres);
    if (updatedGenres.has(genre)) {
      updatedGenres.delete(genre);
    } else {
      updatedGenres.add(genre);
    }
    setSelectedGenres(updatedGenres);
    fetchBooksByGenres(updatedGenres);
  };

  const fetchBooksByGenres = async (genresSet: Set<string>) => {
    setLoading(true);
    try {
      if (genresSet.size > 0) {
        const genresArray = Array.from(genresSet);
        const response = await searchBooksByGenres(genresArray);
        const data = response.data;
        setBooks(data);
      } else {
        fetchBooks();
      }
    } catch (error) {
      console.error('Failed to fetch books by genres:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoto();
    fetchGenres();
    fetchBooks();
  }, []);

  return (
    <div className="home-container">
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
            <img src={userPhoto} />
          </button>
        </div>
      </header>
      <div className="search-container">
        <div className="dropdown-container">
          <button
            className="dropdown-button"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            Вибрати жанри
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              {genres.map((genre) => (
                <label key={genre} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={genre}
                    checked={selectedGenres.has(genre)}
                    onChange={() => handleGenreToggle(genre)}
                  />
                  {genre}
                </label>
              ))}
            </div>
          )}
        </div>
        <input
          className="search-bar"
          type="text"
          placeholder="Пошук книги..."
          value={searchQuery}
          onChange={handleSearchInput}
        />
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
