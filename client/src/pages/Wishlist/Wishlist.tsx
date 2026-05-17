import React, { useEffect, useState } from 'react';
import { Book } from '../../types/Book';
import { getUserWishlist } from '../../api/wishlistApi';
import BookCard from '../../components/BookCard/BookCard';
import './Wishlist.css';

const Wishlist: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try { const r = await getUserWishlist(); setBooks(r.data); }
      catch (error) { console.error('Failed to fetch books:', error); }
      finally { setLoading(false); }
    };
    fetchBooks();
  }, []);

  return (
    <div className="wishlist">
      <h1 className="wishlist__title">Список бажаного</h1>
      {loading ? (
        <div className="wishlist__loading"><p>Завантаження...</p></div>
      ) : books.length > 0 ? (
        <div className="wishlist__grid">
          {books.map((book) => (
            <BookCard key={book.id} id={book.id} title={book.title} author={book.author} city={book.city} photoUrl={book.photos[0]?.photoUrl} />
          ))}
        </div>
      ) : (
        <div className="wishlist__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <p>Список порожній</p>
          <span>Додайте книги, натиснувши на серце</span>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
