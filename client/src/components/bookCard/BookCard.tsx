import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookCard.css';
import { addToWishlist, removeFromWishlist, checkStatus } from '../../api/wishlistApi';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  city: string;
  photoUrl?: string;
}

const BookCard: React.FC<BookCardProps> = ({ id, title, author, city, photoUrl }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await checkStatus(id);
        setIsLiked(response.data); 
      } catch (error) {
        console.error("Error fetching like status:", error);
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
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="book-card" onClick={() => navigate(`/book/${id}`)}>
      <div className="book-photo">
        <img src={photoUrl} alt={`${title} photo`} />
      </div>
      <div className="book-info">
        <h3 className="book-card-title">{title}</h3>
        <p className="book-author">{author}</p>
        <p className="book-city">{city}</p>
        
        {/* Like button */}
        <button 
          className={`like-button ${isLiked ? 'liked' : ''}`} 
          onClick={(e) => { 
            e.stopPropagation();  // Prevent the card from being clicked when the button is clicked
            toggleLike();  // Toggle like state and make API call
          }}
        >
          {isLiked ? '♥' : '♡'} {/* Heart icon changes based on like state */}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
