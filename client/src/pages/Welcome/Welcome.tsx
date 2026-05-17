import { FormEvent, useState } from 'react';
import { loginUser, registerUser } from '../../api/authenticationApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookSwapLogo } from '../../assets/BookSwapLogo';
import './Welcome.css';

interface WelcomeProps {
  mode: 'signin' | 'signup';
}

const Welcome: React.FC<WelcomeProps> = ({ mode }) => {
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();
  const isLogin = mode === 'signin';
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validateUsername = (u: string) => u.length >= 3 && u.length <= 10;
  const validatePassword = (p: string) => {
    return /[A-Z]/.test(p) && /[a-z]/.test(p) && /\d/.test(p) && p.length >= 4 && p.length <= 10;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const response = await loginUser({ email, password });
        setAccessToken(response.data);
        navigate('/');
      } else {
        if (!validateUsername(username)) { setError('Ім\'я має бути від 3 до 10 символів.'); return; }
        if (!validatePassword(password)) { setError('Пароль: 4-10 символів, великі та малі літери, цифра.'); return; }
        if (password !== confirmPassword) { setError('Паролі не співпадають.'); return; }
        const response = await registerUser({ username, email, password });
        setAccessToken(response.data);
        navigate('/');
      }
    } catch { setError('Не вдалося увійти. Перевірте ваші дані.'); }
  };

  return (
    <div className="welcome">
      <div className="welcome__hero">
        <div className="welcome__hero-content">
          <BookSwapLogo className="welcome__logo-svg" />
          <p className="welcome__tagline">Читай легко, Обмінюй швидко</p>
        </div>
      </div>
      <div className="welcome__form-section">
        <div className="welcome__form-card">
          <h2 className="welcome__form-title">{isLogin ? 'Увійти' : 'Зареєструватись'}</h2>
          {error && <p className="welcome__error">{error}</p>}
          <form onSubmit={handleSubmit} className="welcome__form">
            {!isLogin && (
              <div className="form-field">
                <label htmlFor="username" className="form-field__label">Ім'я</label>
                <input type="text" id="username" className="form-field__input" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Введіть ім'я" />
              </div>
            )}
            <div className="form-field">
              <label htmlFor="email" className="form-field__label">Email</label>
              <input type="email" id="email" className="form-field__input" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Введіть email" />
            </div>
            <div className="form-field">
              <label htmlFor="password" className="form-field__label">Пароль</label>
              <input type="password" id="password" className="form-field__input" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Введіть пароль" />
            </div>
            {!isLogin && (
              <div className="form-field">
                <label htmlFor="confirm-password" className="form-field__label">Підтвердіть пароль</label>
                <input type="password" id="confirm-password" className="form-field__input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Підтвердіть пароль" />
              </div>
            )}
            <button type="submit" className="welcome__submit">{isLogin ? 'Увійти' : 'Зареєструватись'}</button>
          </form>
          <p className="welcome__switch">
            {isLogin ? 'Ще не маєте акаунта?' : 'Вже маєте акаунт?'}{' '}
            <span onClick={() => navigate(isLogin ? '/signup' : '/signin')} className="welcome__switch-link">{isLogin ? 'Зареєструватись' : 'Увійти'}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
