import { FormEvent, useState } from "react";
import { loginUser, registerUser } from "../../api/authenticationApi";
import { useAuth } from "../../content/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

const Welcome: React.FC = () => {
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true); // true = login, false = signup
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validateUsername = (username: string): boolean => {
    return username.length >= 3 && username.length <= 10;
  };

  const validatePassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLengthValid = password.length >= 4 && password.length <= 10;
    return hasUpperCase && hasLowerCase && hasNumber && isLengthValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // логін
        const response = await loginUser({ email, password });
        const accessToken = response.data;
        setAccessToken(accessToken);
        navigate("/home");
      } else {
        // реєстрація
        if (!validateUsername(username)) {
          setError("Username must be between 3 and 10 characters.");
          return;
        }

        if (!validatePassword(password)) {
          setError(
            "Password must be 4-10 chars, include uppercase, lowercase and digit."
          );
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const response = await registerUser({ username, email, password });
        const accessToken = response.data;
        setAccessToken(accessToken);
        navigate("/home");
      }
    } catch {
      setError("Failed to submit. Please check your credentials.");
    }
  };

  return (
    <div className="welcome-page">
      <header className="home-header">
        <div className="logo">BookSwap</div>
      </header>

      <div className="welcome-content">
        {/* Ліва частина */}
        <div className="left-section">
          <h1 className="logo-large">BookSwap</h1>
          <p className="description">Читай легко, Обмінюй швидко</p>
        </div>

        {/* Права частина */}
        <div className="right-section">
          <div className="auth-container">
            <h2>{isLogin ? "Увійти" : "Зареєструватись"}</h2>
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="username">Ім'я</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Введіть ім'я"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Введіть email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Введіть пароль"
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirm-password">Підтвердіть пароль</label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Підтвердіть пароль"
                  />
                </div>
              )}

              <button type="submit" className="auth-btn">
                {isLogin ? "Увійти" : "Зареєструватись"}
              </button>
            </form>

            {/* Перемикач */}
            <p className="switch-text">
              {isLogin ? "Ще не маєте акаунта?" : "Вже маєте акаунт?"}{" "}
              <span onClick={() => setIsLogin(!isLogin)} className="switch-link">
                {isLogin ? "Зареєструватись" : "Увійти"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
