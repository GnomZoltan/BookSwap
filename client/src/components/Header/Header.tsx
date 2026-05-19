import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyself } from '../../api/userApi';
import { jwtDecode } from 'jwt-decode';
import { BookSwapLogo } from '../../assets/BookSwapLogo';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [userPhoto, setUserPhoto] = useState('');

  const isAuthenticated = !!accessToken;
  const loggedUserId = accessToken ? jwtDecode<{ id: string }>(accessToken).id : null;

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchPhoto = async () => {
      try {
        const response = await getMyself();
        setUserPhoto(response.data.photoUrl);
      } catch (error) {
        console.error('Failed to fetch photo:', error);
      }
    };
    fetchPhoto();
  }, [isAuthenticated]);

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__logo" onClick={() => navigate('/')}>
          <BookSwapLogo className="header__logo-svg" />
        </div>
        <nav className="header__nav">
          {isAuthenticated ? (
            <>
              <button
                className="header__nav-btn"
                onClick={() => navigate('/wishlist')}
                aria-label="Wishlist"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <button
                className="header__nav-btn"
                onClick={() => navigate('/conversations')}
                aria-label="Messages"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
              <button
                className="header__add-btn"
                onClick={() => navigate('/add-book')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Додати
              </button>
              <button
                className="header__nav-btn header__nav-btn--avatar"
                onClick={() => navigate(`/profile/${loggedUserId}`)}
                aria-label="Profile"
              >
                {userPhoto ? (
                  <img src={userPhoto} alt="Profile" className="header__avatar" />
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
              </button>
            </>
          ) : (
            <div className="header__auth">
              <button className="header__auth-btn" onClick={() => navigate('/signin')}>
                Увійти
              </button>
              <button className="header__auth-btn header__auth-btn--primary" onClick={() => navigate('/signup')}>
                Зареєструватись
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
