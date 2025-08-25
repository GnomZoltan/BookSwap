// import React, { useEffect, useState } from 'react';
// import './Wishlist.css';
// import { Book } from '../../types/Book';
// import { getUserWishlist } from '../../api/wishlistApi';
// import BookCard from '../../components/bookCard/BookCard';

// const Wishlist: React.FC = () => {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchBooks = async () => {
//     setLoading(true);
//     try {
//       const response = await getUserWishlist();
//       const data = response.data;
//       setBooks(data);
//     } catch (error) {
//       console.error('Failed to fetch books:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   return (
//     <div className="home-container">
//       <main className="books-container">
//         {loading ? (
//           <p>Loading books...</p>
//         ) : books.length > 0 ? (
//           books.map((book) => (
//             <BookCard
//               key={book.id}
//               id={book.id}
//               title={book.title}
//               author={book.author}
//               city={book.city}
//               photoUrl={book.photos[0]?.photoUrl}
//             />
//           ))
//         ) : (
//           <p>No books available</p>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Wishlist;


import React, { useEffect, useState } from 'react';
import './Wishlist.css';
import { Book } from '../../types/Book';
import { getUserWishlist } from '../../api/wishlistApi';
import BookCard from '../../components/bookCard/BookCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../content/AuthContext';
import { getMyself } from '../../api/userApi';
import { jwtDecode } from 'jwt-decode';

const Wishlist: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPhoto, setUserPhoto] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const loggedUserId = accessToken ? jwtDecode<{ id: string }>(accessToken).id : null;

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
    fetchBooks();
    fetchPhoto();
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
            <img src={userPhoto} alt="profile" />
          </button>
        </div>
      </header>

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
