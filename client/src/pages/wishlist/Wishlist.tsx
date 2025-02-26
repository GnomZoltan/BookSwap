import React, { useEffect, useState } from 'react';
import './Wishlist.css';
import { Book } from '../../types/Book';
import { getUserWishlist } from '../../api/wishlistApi';
import BookCard from '../../components/bookCard/BookCard';

const Wishlist: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await getUserWishlist();
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

export default Wishlist;
