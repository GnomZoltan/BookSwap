import React, { useEffect, useState } from 'react';
import { Book } from '../../types/Book';
import { getAllAvailableBooks, searchBooks, searchBooksByGenres } from '../../api/bookApi';
import { getAllGenres } from '../../api/genreApi';
import BookCard from '../../components/BookCard/BookCard';
import './Home.css';

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    try { const response = await getAllAvailableBooks(); setBooks(response.data); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const fetchGenres = async () => {
    try {
      const response = await getAllGenres();
      if (response.data && Array.isArray(response.data)) {
        setGenres(response.data.map((g: { name: string }) => g.name));
      }
    } catch { /* ignore */ }
  };

  const handleSearchInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query === '') { fetchBooks(); return; }
    setLoading(true);
    try { const response = await searchBooks(query); setBooks(response.data); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleGenreToggle = (genre: string) => {
    const updated = new Set(selectedGenres);
    if (updated.has(genre)) updated.delete(genre); else updated.add(genre);
    setSelectedGenres(updated);
    fetchBooksByGenres(updated);
  };

  const fetchBooksByGenres = async (genresSet: Set<string>) => {
    setLoading(true);
    try {
      if (genresSet.size > 0) { const response = await searchBooksByGenres(Array.from(genresSet)); setBooks(response.data); }
      else { fetchBooks(); }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchGenres(); fetchBooks(); }, []);

  return (
    <div className="home">
      <div className="home__toolbar">
        <div className="home__search">
          <svg className="home__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="home__search-input"
            type="text"
            placeholder="Знайти книгу за назвою або автором..."
            value={searchQuery}
            onChange={handleSearchInput}
          />
        </div>
        {genres.length > 0 && (
          <div className="home__genres">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`home__genre-chip ${selectedGenres.has(genre) ? 'home__genre-chip--active' : ''}`}
                onClick={() => handleGenreToggle(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="home__loading">
          <div className="home__skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="home__skeleton" />
            ))}
          </div>
        </div>
      ) : books.length > 0 ? (
        <div className="home__grid">
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              city={book.city}
              photoUrl={book.photos[0]?.photoUrl}
              forFree={book.forFree}
            />
          ))}
        </div>
      ) : (
        <div className="home__empty">
          <div className="home__empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <p className="home__empty-title">Книги не знайдено</p>
          <p className="home__empty-sub">Спробуйте інший запит або жанр</p>
        </div>
      )}
    </div>
  );
};

export default Home;
