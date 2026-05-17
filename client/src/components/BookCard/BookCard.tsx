import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToWishlist, removeFromWishlist, checkStatus } from '../../api/wishlistApi';
import './BookCard.css';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  city: string;
  photoUrl?: string;
}

const BookCard: React.FC<BookCardProps> = ({ id, title, author, city, photoUrl }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await checkStatus(id);
        setIsLiked(response.data);
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };
    fetchStatus();
  }, [id]);

  const toggleLike = async () => {
    try {
      if (isLiked) {
        await removeFromWishlist(id);
      } else {
        await addToWishlist(id);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="book-card" onClick={() => navigate(`/book/${id}`)}>
      <div className="book-card__image">
        {photoUrl ? (
          <img src={photoUrl} alt={title} />
        ) : (
          <div className="book-card__placeholder">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
        )}
      </div>
      <div className="book-card__body">
        <h3 className="book-card__title">{title}</h3>
        <p className="book-card__author">{author}</p>
        <div className="book-card__footer">
          <span className="book-card__city">{city}</span>
          <button
            className={`book-card__like ${isLiked ? 'book-card__like--active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleLike(); }}
            aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
